const express = require('express');
const router = express.Router();
const {
  generateListingOpenAI,
  generateListingGemini,
  moderateContentOpenAI,
  moderateContentGemini,
} = require('../lib/openai');
const {
  generateListingGroq,
  moderateContentGroq,
  smartSearchGroq,
  detectFraudGroq,
} = require('../lib/groq');
const { authenticate } = require('../middleware/auth');

// Generate listing — Groq by default, with OpenAI/Gemini as fallback providers
router.post('/generate-listing', authenticate, async (req, res) => {
  try {
    const { productName, category, provider = 'groq' } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ success: false, error: 'Product name and category required' });
    }

    let result;
    try {
      if (provider === 'gemini') result = await generateListingGemini(productName, category);
      else if (provider === 'openai') result = await generateListingOpenAI(productName, category);
      else result = await generateListingGroq(productName, category);
    } catch (err) {
      // Groq/primary failed — fall back to Gemini if configured
      result = await generateListingGemini(productName, category);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Moderate content — Groq by default
router.post('/moderate', authenticate, async (req, res) => {
  try {
    const { content, provider = 'groq' } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content required' });
    }

    let result;
    if (provider === 'gemini') result = await moderateContentGemini(content);
    else if (provider === 'openai') result = await moderateContentOpenAI(content);
    else result = await moderateContentGroq(content);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Smart search — public (no auth) so anonymous buyers get AI-assisted search too
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const result = await smartSearchGroq(query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fraud detection — Groq only (admin/internal use)
router.post('/detect-fraud', authenticate, async (req, res) => {
  try {
    const { listingData } = req.body;

    if (!listingData) {
      return res.status(400).json({ success: false, error: 'Listing data required' });
    }

    const result = await detectFraudGroq(listingData);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
