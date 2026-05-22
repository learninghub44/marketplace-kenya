const express = require('express');
const router = express.Router();
const {
  productAssistantAgent,
  buyerAssistantAgent,
  fraudDetectionAgent,
  supportAgent,
  smartSearchAgent,
  moderationAgent,
  logAgentCall,
} = require('../lib/agents');
// Keep backward-compat exports from openai.js
const { generateListingGemini, generateListingOpenAI } = require('../lib/openai');
const { authenticate, authorize } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

const timed = async (fn) => {
  const start = Date.now();
  const result = await fn();
  return { result, duration: Date.now() - start };
};

// ── POST /api/ai/product-assistant (seller only) ──────────────────────────────
router.post('/product-assistant', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { productName, category, subcategory, condition, price, existingDescription } = req.body;
    if (!productName || !category)
      return res.status(400).json({ success: false, error: 'productName and category required' });

    const { result, duration } = await timed(() =>
      productAssistantAgent({ productName, category, subcategory, condition, price, existingDescription })
    );

    await logAgentCall(supabaseAdmin, {
      userId: req.user.userId, tenantId: req.user.tenantId,
      agentType: 'product_assistant', userRole: 'seller',
      input: { productName, category }, output: result, durationMs: duration, success: true,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/ai/buyer-assistant (buyer or public) ────────────────────────────
router.post('/buyer-assistant', async (req, res) => {
  try {
    const { query, budget, location, category, listings } = req.body;
    if (!query) return res.status(400).json({ success: false, error: 'query required' });

    const { result, duration } = await timed(() =>
      buyerAssistantAgent({ query, budget, location, category, listings: listings || [] })
    );

    const userId = req.headers.authorization ? (() => {
      try { return require('../lib/auth').verifyToken(req.headers.authorization.replace('Bearer ','')).userId; } catch { return null; }
    })() : null;

    await logAgentCall(supabaseAdmin, {
      userId, tenantId: '00000000-0000-0000-0000-000000000000',
      agentType: 'buyer_assistant', userRole: 'buyer',
      input: { query, budget, location }, output: result, durationMs: duration, success: true,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/ai/detect-fraud (admin only) ────────────────────────────────────
router.post('/detect-fraud', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { listingData, sellerHistory } = req.body;
    if (!listingData) return res.status(400).json({ success: false, error: 'listingData required' });

    const { result, duration } = await timed(() =>
      fraudDetectionAgent({ listing: listingData, sellerHistory })
    );

    await logAgentCall(supabaseAdmin, {
      userId: req.user.userId, tenantId: req.user.tenantId,
      agentType: 'fraud_agent', userRole: 'admin',
      input: { listing_id: listingData.id }, output: result, durationMs: duration, success: true,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/ai/support-agent (admin/support) ────────────────────────────────
router.post('/support-agent', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { ticketSubject, ticketMessage, userRole, previousResponses } = req.body;
    if (!ticketSubject || !ticketMessage)
      return res.status(400).json({ success: false, error: 'ticketSubject and ticketMessage required' });

    const { result, duration } = await timed(() =>
      supportAgent({ ticketSubject, ticketMessage, userRole, previousResponses })
    );

    await logAgentCall(supabaseAdmin, {
      userId: req.user.userId, tenantId: req.user.tenantId,
      agentType: 'support_agent', userRole: 'admin',
      input: { ticketSubject, userRole }, output: result, durationMs: duration, success: true,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/ai/smart-search (public) ───────────────────────────────────────
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, error: 'query required' });

    const { result, duration } = await timed(() => smartSearchAgent(query));

    await logAgentCall(supabaseAdmin, {
      userId: null, tenantId: '00000000-0000-0000-0000-000000000000',
      agentType: 'smart_search', userRole: null,
      input: { query }, output: result, durationMs: duration, success: true,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/ai/moderate (admin/seller) ─────────────────────────────────────
router.post('/moderate', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'content required' });

    const { result, duration } = await timed(() => moderationAgent(content));

    await logAgentCall(supabaseAdmin, {
      userId: req.user.userId, tenantId: req.user.tenantId,
      agentType: 'moderation', userRole: req.user.role,
      input: { content_length: content.length }, output: result, durationMs: duration, success: true,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST /api/ai/generate-listing (legacy + seller) ──────────────────────────
router.post('/generate-listing', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { productName, category, provider = 'gemini' } = req.body;
    if (!productName || !category)
      return res.status(400).json({ success: false, error: 'Product name and category required' });

    let result;
    if (provider === 'openai') {
      result = await generateListingOpenAI(productName, category);
    } else {
      result = await generateListingGemini(productName, category);
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET /api/ai/logs (admin) ──────────────────────────────────────────────────
router.get('/logs', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { agent_type, limit = 50, offset = 0 } = req.query;
    let query = supabaseAdmin
      .from('ai_agent_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (agent_type) query = query.eq('agent_type', agent_type);

    const { data: logs, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, logs: logs || [], total: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
