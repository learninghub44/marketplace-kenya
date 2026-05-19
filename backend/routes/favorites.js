const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// Get user's favorites
router.get('/', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select('*, listings(*)')
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add to favorites
router.post('/', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listing_id } = req.body;

    if (!listing_id) {
      return res.status(400).json({ success: false, error: 'Listing ID required' });
    }

    // Check if already favorited
    const { data: existing } = await supabaseAdmin
      .from('favorites')
      .select('*')
      .eq('buyer_id', userId)
      .eq('listing_id', listing_id)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, error: 'Already favorited' });
    }

    const { data: favorite, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        buyer_id: userId,
        listing_id,
        tenant_id: req.user.tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, favorite });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove from favorites
router.delete('/:id', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('buyer_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
