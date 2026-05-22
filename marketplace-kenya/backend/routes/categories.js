const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// GET all categories with subcategories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*, subcategories(*)')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json({ success: true, categories: categories || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single category with subcategories
router.get('/:slug', async (req, res) => {
  try {
    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .select('*, subcategories(*)')
      .eq('slug', req.params.slug)
      .eq('is_active', true)
      .single();
    if (error) throw error;
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all brands
router.get('/brands/all', async (req, res) => {
  try {
    const { data: brands, error } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (error) throw error;
    res.json({ success: true, brands: brands || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create category (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, slug, emoji, image_url, description, display_order } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, error: 'Name and slug required' });
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name, slug, emoji, image_url, description, display_order: display_order || 0 })
      .select().single();
    if (error) throw error;
    res.json({ success: true, category: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create subcategory (admin only)
router.post('/:categoryId/subcategories', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, error: 'Name and slug required' });
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .insert({ category_id: req.params.categoryId, name, slug, description })
      .select().single();
    if (error) throw error;
    res.json({ success: true, subcategory: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create brand (admin only)
router.post('/brands', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, slug, logo_url } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, error: 'Name and slug required' });
    const { data, error } = await supabaseAdmin
      .from('brands')
      .insert({ name, slug, logo_url })
      .select().single();
    if (error) throw error;
    res.json({ success: true, brand: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
