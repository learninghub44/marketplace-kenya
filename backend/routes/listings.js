const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// ── GET all listings (public) ─────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      status = 'active',
      category,
      subcategory_id,
      brand_id,
      search,
      location,
      condition,
      price_min,
      price_max,
      in_stock,
      featured,
      seller_id,
      sort,
      limit = 24,
      offset = 0,
    } = req.query;

    let query = supabaseAdmin
      .from('listings')
      .select(`
        id, title, description, price, category, subcategory_id, brand_id,
        location, images, status, condition, stock_quantity, discount_percent,
        is_negotiable, delivery_available, delivery_cost, featured, views,
        seo_tags, created_at, seller_id,
        listing_images(id, url, is_primary, order_index),
        sellers(id, business_name, logo_url, verified, rating)
      `, { count: 'exact' });

    // Filters
    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (subcategory_id) query = query.eq('subcategory_id', subcategory_id);
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (condition) query = query.eq('condition', condition);
    if (seller_id) query = query.eq('seller_id', seller_id);
    if (featured === 'true') query = query.eq('featured', true);
    if (in_stock === 'true') query = query.gt('stock_quantity', 0);
    if (location && location !== 'All Locations') query = query.ilike('location', `%${location}%`);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    if (price_min) query = query.gte('price', parseFloat(price_min));
    if (price_max) query = query.lte('price', parseFloat(price_max));

    // Sorting
    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort === 'popular') query = query.order('views', { ascending: false });
    else if (sort === 'discount') query = query.order('discount_percent', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data: listings, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      listings: listings || [],
      total: count,
      page: { limit: Number(limit), offset: Number(offset), has_more: Number(offset) + Number(limit) < (count || 0) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET my listings (seller) ──────────────────────────────────────────────────
router.get('/my', authenticate, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = supabaseAdmin
      .from('listings')
      .select('*, listing_images(id, url, is_primary, order_index)', { count: 'exact' })
      .eq('seller_id', req.user.userId)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data: listings, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, listings: listings || [], total: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET single listing (public) ───────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .select(`
        *,
        listing_images(id, url, is_primary, order_index, alt_text),
        product_variants(id, name, value, price_modifier, stock_quantity, sku),
        sellers(id, business_name, logo_url, verified, rating, total_reviews, total_sales, location, response_time_hours)
      `)
      .eq('id', req.params.id)
      .single();
    if (error) throw error;

    // Increment view count (non-blocking)
    supabaseAdmin.from('listings').update({ views: (listing.views || 0) + 1 }).eq('id', req.params.id).then(() => {});

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── POST create listing (seller) ──────────────────────────────────────────────
router.post('/', authenticate, authorize('seller'), async (req, res) => {
  try {
    const {
      title, description, price, category, subcategory_id, brand_id,
      location, images = [], condition = 'new', stock_quantity = 1,
      discount_percent = 0, is_negotiable = false, delivery_available = false,
      delivery_cost = 0, weight_kg, sku, seo_tags = [], hashtags = [],
      ai_generated = false, variants = [],
    } = req.body;

    if (!title || !description || !price || !category || !location)
      return res.status(400).json({ success: false, error: 'Title, description, price, category and location are required' });

    const tenantId = req.user.tenantId || uuidv4();

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .insert({
        seller_id: req.user.userId,
        tenant_id: tenantId,
        title, description,
        price: parseFloat(price),
        category,
        subcategory_id: subcategory_id || null,
        brand_id: brand_id || null,
        location,
        images,
        condition,
        stock_quantity: parseInt(stock_quantity),
        discount_percent: parseFloat(discount_percent),
        is_negotiable,
        delivery_available,
        delivery_cost: parseFloat(delivery_cost),
        weight_kg: weight_kg ? parseFloat(weight_kg) : null,
        sku: sku || null,
        seo_tags,
        hashtags,
        ai_generated,
        status: 'pending',
      })
      .select().single();
    if (error) throw error;

    // Insert images into listing_images table
    if (images.length > 0) {
      const imageRows = images.map((url, i) => ({
        listing_id: listing.id,
        url,
        order_index: i,
        is_primary: i === 0,
        tenant_id: tenantId,
      }));
      await supabaseAdmin.from('listing_images').insert(imageRows);
    }

    // Insert product variants
    if (variants.length > 0) {
      const variantRows = variants.map(v => ({ ...v, listing_id: listing.id, tenant_id: tenantId }));
      await supabaseAdmin.from('product_variants').insert(variantRows);
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── PUT update listing (seller) ───────────────────────────────────────────────
router.put('/:id', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { data: existing } = await supabaseAdmin
      .from('listings').select('seller_id').eq('id', req.params.id).single();
    if (!existing || existing.seller_id !== req.user.userId)
      return res.status(403).json({ success: false, error: 'Not your listing' });

    const {
      title, description, price, category, subcategory_id, brand_id,
      location, images, condition, stock_quantity, discount_percent,
      is_negotiable, delivery_available, delivery_cost, weight_kg,
      sku, seo_tags, hashtags,
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (subcategory_id !== undefined) updateData.subcategory_id = subcategory_id || null;
    if (brand_id !== undefined) updateData.brand_id = brand_id || null;
    if (location !== undefined) updateData.location = location;
    if (images !== undefined) updateData.images = images;
    if (condition !== undefined) updateData.condition = condition;
    if (stock_quantity !== undefined) updateData.stock_quantity = parseInt(stock_quantity);
    if (discount_percent !== undefined) updateData.discount_percent = parseFloat(discount_percent);
    if (is_negotiable !== undefined) updateData.is_negotiable = is_negotiable;
    if (delivery_available !== undefined) updateData.delivery_available = delivery_available;
    if (delivery_cost !== undefined) updateData.delivery_cost = parseFloat(delivery_cost);
    if (weight_kg !== undefined) updateData.weight_kg = weight_kg ? parseFloat(weight_kg) : null;
    if (sku !== undefined) updateData.sku = sku || null;
    if (seo_tags !== undefined) updateData.seo_tags = seo_tags;
    if (hashtags !== undefined) updateData.hashtags = hashtags;
    updateData.status = 'pending'; // requires re-approval

    const { data: listing, error } = await supabaseAdmin
      .from('listings').update(updateData).eq('id', req.params.id).select().single();
    if (error) throw error;

    // Sync listing_images if images provided
    if (images !== undefined) {
      await supabaseAdmin.from('listing_images').delete().eq('listing_id', req.params.id);
      if (images.length > 0) {
        const tenantId = req.user.tenantId || uuidv4();
        const imageRows = images.map((url, i) => ({
          listing_id: req.params.id,
          url, order_index: i, is_primary: i === 0, tenant_id: tenantId,
        }));
        await supabaseAdmin.from('listing_images').insert(imageRows);
      }
    }

    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── PATCH update stock (seller) ───────────────────────────────────────────────
router.patch('/:id/stock', authenticate, authorize('seller'), async (req, res) => {
  try {
    const { stock_quantity } = req.body;
    const { data: existing } = await supabaseAdmin
      .from('listings').select('seller_id').eq('id', req.params.id).single();
    if (!existing || existing.seller_id !== req.user.userId)
      return res.status(403).json({ success: false, error: 'Not your listing' });

    const { data, error } = await supabaseAdmin
      .from('listings').update({ stock_quantity: parseInt(stock_quantity) })
      .eq('id', req.params.id).select('id, stock_quantity').single();
    if (error) throw error;
    res.json({ success: true, listing: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── DELETE listing ────────────────────────────────────────────────────────────
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

// ── GET listing images ────────────────────────────────────────────────────────
router.get('/:id/images', async (req, res) => {
  try {
    const { data: images, error } = await supabaseAdmin
      .from('listing_images')
      .select('*')
      .eq('listing_id', req.params.id)
      .order('order_index', { ascending: true });
    if (error) throw error;
    res.json({ success: true, images: images || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── GET listing variants ──────────────────────────────────────────────────────
router.get('/:id/variants', async (req, res) => {
  try {
    const { data: variants, error } = await supabaseAdmin
      .from('product_variants').select('*').eq('listing_id', req.params.id);
    if (error) throw error;
    res.json({ success: true, variants: variants || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
