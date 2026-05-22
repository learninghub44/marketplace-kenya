const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// Get seller profile
router.get('/profile', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: seller, error } = await supabaseAdmin
      .from('sellers')
      .select('*, users(*)')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update seller profile
router.put('/profile', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { business_name, business_description, phone } = req.body;

    const { data: seller, error } = await supabaseAdmin
      .from('sellers')
      .update({
        business_name,
        business_description,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Update phone in users table if provided
    if (phone) {
      await supabaseAdmin
        .from('users')
        .update({ phone })
        .eq('id', userId);
    }

    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get seller's listings
router.get('/listings', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
