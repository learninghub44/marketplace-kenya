const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');
const { moderateContentGroq, detectFraudGroq } = require('../lib/groq');

// Run AI moderation + fraud checks on a listing. Never throws — returns safe defaults on failure
// so a flaky AI provider can never block someone from listing a product.
const runAiChecks = async ({ title, description, price, category }) => {
  try {
    const [moderation, fraud] = await Promise.all([
      moderateContentGroq(`${title}\n\n${description}`),
      detectFraudGroq({ title, description, price, category }),
    ]);
    return {
      ai_flagged: !!moderation.flagged,
      ai_flag_reason: moderation.reason || null,
      ai_fraud_score: typeof fraud.confidence === 'number' ? fraud.confidence : 0,
      ai_fraud_reasons: fraud.reasons || [],
      ai_checked_at: new Date().toISOString(),
    };
  } catch (e) {
    return {
      ai_flagged: false,
      ai_flag_reason: null,
      ai_fraud_score: 0,
      ai_fraud_reasons: [],
      ai_checked_at: new Date().toISOString(),
    };
  }
};

// GET all listings (public)
router.get('/', async (req, res) => {
  try {
    const { status, category, search, location, sort, limit = 24, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from('listings')
      .select('id,title,description,price,category,location,images,status,created_at,seller_id', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (location && location !== 'All Locations') query = query.ilike('location', `%${location}%`);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data: listings, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, listings: listings || [], total: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET my listings (seller)
router.get('/my', authenticate, async (req, res) => {
  try {
    const { data: listings, error } = await supabaseAdmin
      .from('listings').select('*')
      .eq('seller_id', req.user.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, listings: listings || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single listing (public)
router.get('/:id', async (req, res) => {
  try {
    const { data: listing, error } = await supabaseAdmin
      .from('listings').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create listing (seller)
router.post('/', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { title, description, price, category, location, images = [] } = req.body;
    if (!title || !description || !price || !category || !location)
      return res.status(400).json({ success: false, error: 'Title, description, price, category and location are required' });

    const aiChecks = await runAiChecks({ title, description, price: parseFloat(price), category });

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .insert({
        seller_id: req.user.userId,
        tenant_id: req.user.tenantId || require('uuid').v4(),
        title, description,
        price: parseFloat(price),
        category, location, images,
        status: 'pending',
        ...aiChecks,
      })
      .select().single();
    if (error) throw error;
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update listing
router.put('/:id', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { data: existing } = await supabaseAdmin
      .from('listings').select('seller_id').eq('id', req.params.id).single();
    if (!existing || existing.seller_id !== req.user.userId)
      return res.status(403).json({ success: false, error: 'Not your listing' });

    const { title, description, price, category, location, images } = req.body;
    const aiChecks = await runAiChecks({ title, description, price: parseFloat(price), category });
    const { data: listing, error } = await supabaseAdmin
      .from('listings').update({ title, description, price: parseFloat(price), category, location, images, status: 'pending', ...aiChecks })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE listing
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { data: existing } = await supabaseAdmin
      .from('listings').select('seller_id').eq('id', req.params.id).single();
    if (!existing) return res.status(404).json({ success: false, error: 'Listing not found' });
    if (existing.seller_id !== req.user.userId && req.user.role !== 'admin')
      return res.status(403).json({ success: false, error: 'Not authorized' });

    const { error } = await supabaseAdmin.from('listings').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
