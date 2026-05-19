const express = require('express');
const router = express.Router();
const {
  generateListingOpenAI,
  generateListingGemini,
  moderateContentOpenAI,
  moderateContentGemini,
  generateSmartSearchOpenAI,
  generateSmartSearchGemini,
  detectFraudOpenAI,
  detectFraudGemini,
} = require('../lib/openai');
const { authenticate } = require('../middleware/auth');

// Generate listing
router.post('/generate-listing', authenticate, async (req, res) => {
  try {
    const { productName, category, provider = 'openai' } = req.body;

    if (!productName || !category) {
      return res.status(400).json({ success: false, error: 'Product name and category required' });
    }

    let result;
    if (provider === 'gemini') {
      result = await generateListingGemini(productName, category);
    } else {
      result = await generateListingOpenAI(productName, category);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Moderate content
router.post('/moderate', authenticate, async (req, res) => {
  try {
    const { content, provider = 'openai' } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content required' });
    }

    let result;
    if (provider === 'gemini') {
      result = await moderateContentGemini(content);
    } else {
      result = await moderateContentOpenAI(content);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Smart search
router.post('/smart-search', authenticate, async (req, res) => {
  try {
    const { query, provider = 'openai' } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    let result;
    if (provider === 'gemini') {
      result = await generateSmartSearchGemini(query);
    } else {
      result = await generateSmartSearchOpenAI(query);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fraud detection
router.post('/detect-fraud', authenticate, async (req, res) => {
  try {
    const { listingData, provider = 'openai' } = req.body;

    if (!listingData) {
      return res.status(400).json({ success: false, error: 'Listing data required' });
    }

    let result;
    if (provider === 'gemini') {
      result = await detectFraudGemini(listingData);
    } else {
      result = await detectFraudOpenAI(listingData);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
