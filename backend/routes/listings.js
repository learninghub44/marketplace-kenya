const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// Get all listings
router.get('/', async (req, res) => {
  try {
    const { status, category, search, seller_id } = req.query;

    let query = supabaseAdmin
      .from('listings')
      .select('*, sellers(*)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (seller_id) query = query.eq('seller_id', seller_id);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data: listings, error } = await query;

    if (error) throw error;

    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single listing
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .select('*, sellers(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Increment view count
    await supabaseAdmin
      .from('listings')
      .update({ view_count: (listing.view_count || 0) + 1 })
      .eq('id', id);

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create listing
router.post('/', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, price, category, location, images } = req.body;

    // Check seller's package limits
    const { data: seller } = await supabaseAdmin
      .from('sellers')
      .select('*')
      .eq('id', userId)
      .single();

    if (!seller) {
      return res.status(404).json({ success: false, error: 'Seller not found' });
    }

    // Check if subscription is active
    if (seller.subscription_expires_at && new Date(seller.subscription_expires_at) < new Date()) {
      return res.status(403).json({ success: false, error: 'Subscription expired' });
    }

    // Check listing limits based on package
    const packageLimits = {
      starter: 10,
      business: 50,
      premium: 999999,
    };

    const limit = packageLimits[seller.package_type] || 10;

    const { count } = await supabaseAdmin
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId);

    if (count >= limit) {
      return res.status(403).json({ success: false, error: 'Listing limit reached' });
    }

    // Create listing
    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .insert({
        seller_id: userId,
        title,
        description,
        price,
        category,
        location,
        images: images || [],
        status: 'pending',
        tenant_id: req.user.tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update listing
router.put('/:id', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    // Check ownership
    const { data: existing } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing || existing.seller_id !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete listing
router.delete('/:id', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check ownership
    const { data: existing } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (!existing || existing.seller_id !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const { error } = await supabaseAdmin
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
