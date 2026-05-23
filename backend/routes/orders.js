const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SKN-${ts}-${rand}`;
}

async function getActiveCart(buyerId) {
  const { data, error } = await supabaseAdmin
    .from('carts')
    .select('*, cart_items(*, listings(id, title, price, images, stock_quantity, delivery_cost, seller_id, status))')
    .eq('buyer_id', buyerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// ── CART ROUTES ───────────────────────────────────────────────────────────────

// GET cart
router.get('/cart', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const cart = await getActiveCart(req.user.userId);
    if (!cart) return res.json({ success: true, cart: null, items: [], total: 0 });

    const items = (cart.cart_items || []).map(item => ({
      ...item,
      listing: item.listings,
    }));
    const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    res.json({ success: true, cart: { id: cart.id, status: cart.status }, items, total, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST add item to cart
router.post('/cart/items', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const { listing_id, quantity = 1, variant_id } = req.body;
    if (!listing_id) return res.status(400).json({ success: false, error: 'listing_id required' });

    // Validate listing exists and is active
    const { data: listing, error: listErr } = await supabaseAdmin
      .from('listings').select('id, price, status, stock_quantity, seller_id').eq('id', listing_id).single();
    if (listErr || !listing) return res.status(404).json({ success: false, error: 'Listing not found' });
    if (!['active', 'approved'].includes(listing.status))
      return res.status(400).json({ success: false, error: 'Listing is not available' });
    if (listing.stock_quantity !== null && listing.stock_quantity < quantity)
      return res.status(400).json({ success: false, error: 'Insufficient stock' });

    // Get or create cart
    let cart = await getActiveCart(req.user.userId);
    if (!cart) {
      const tenantId = req.user.tenantId || uuidv4();
      const { data: newCart, error: cartErr } = await supabaseAdmin
        .from('carts').insert({ buyer_id: req.user.userId, tenant_id: tenantId, status: 'active' }).select().single();
      if (cartErr) throw cartErr;
      cart = { ...newCart, cart_items: [] };
    }

    // Upsert cart item
    const { data: existing } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('listing_id', listing_id)
      .is(variant_id ? 'variant_id' : 'variant_id', variant_id || null)
      .maybeSingle();

    let cartItem;
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
        .eq('id', existing.id).select().single();
      if (error) throw error;
      cartItem = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('cart_items')
        .insert({ cart_id: cart.id, listing_id, variant_id: variant_id || null, quantity, unit_price: listing.price })
        .select().single();
      if (error) throw error;
      cartItem = data;
    }

    res.json({ success: true, item: cartItem, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update cart item quantity
router.put('/cart/items/:itemId', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });

    const cart = await getActiveCart(req.user.userId);
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    const { data: item, error } = await supabaseAdmin
      .from('cart_items').update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', req.params.itemId).eq('cart_id', cart.id).select().single();
    if (error) throw error;
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE remove cart item
router.delete('/cart/items/:itemId', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const cart = await getActiveCart(req.user.userId);
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    const { error } = await supabaseAdmin
      .from('cart_items').delete().eq('id', req.params.itemId).eq('cart_id', cart.id);
    if (error) throw error;
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE clear entire cart
router.delete('/cart', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const cart = await getActiveCart(req.user.userId);
    if (!cart) return res.json({ success: true, message: 'Cart already empty' });

    await supabaseAdmin.from('cart_items').delete().eq('cart_id', cart.id);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── ORDER ROUTES ──────────────────────────────────────────────────────────────

// POST checkout — create order(s) from cart
router.post('/checkout', authenticate, authorize('buyer'), async (req, res) => {
  try {
    const { delivery_address, delivery_notes, payment_method = 'mpesa' } = req.body;
    if (!delivery_address) return res.status(400).json({ success: false, error: 'Delivery address required' });

    const cart = await getActiveCart(req.user.userId);
    if (!cart || !cart.cart_items || cart.cart_items.length === 0)
      return res.status(400).json({ success: false, error: 'Cart is empty' });

    const tenantId = req.user.tenantId || uuidv4();
    const items = cart.cart_items;

    // Group items by seller
    const bySeller = {};
    for (const item of items) {
      const sid = item.listings?.seller_id;
      if (!sid) continue;
      if (!bySeller[sid]) bySeller[sid] = [];
      bySeller[sid].push(item);
    }

    const createdOrders = [];
    for (const [sellerId, sellerItems] of Object.entries(bySeller)) {
      const subtotal = sellerItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
      const deliveryCost = sellerItems.reduce((s, i) => s + (i.listings?.delivery_cost || 0), 0);
      const total = subtotal + deliveryCost;

      const { data: order, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: generateOrderNumber(),
          buyer_id: req.user.userId,
          seller_id: sellerId,
          status: 'pending',
          subtotal,
          delivery_cost: deliveryCost,
          total_amount: total,
          payment_method,
          delivery_address,
          delivery_notes: delivery_notes || null,
          tenant_id: tenantId,
        })
        .select().single();
      if (orderErr) throw orderErr;

      // Insert order items
      const orderItemsData = sellerItems.map(item => ({
        order_id: order.id,
        listing_id: item.listing_id,
        variant_id: item.variant_id || null,
        title: item.listings?.title || 'Product',
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percent: 0,
        total_price: item.unit_price * item.quantity,
      }));
      const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItemsData);
      if (itemsErr) throw itemsErr;

      // Create initial tracking entry
      await supabaseAdmin.from('order_tracking').insert({
        order_id: order.id,
        status: 'pending',
        description: 'Order placed successfully. Awaiting payment.',
        created_by: req.user.userId,
      });

      createdOrders.push(order);
    }

    // Mark cart as checked out
    await supabaseAdmin.from('carts').update({ status: 'checked_out' }).eq('id', cart.id);

    res.json({ success: true, orders: createdOrders, message: `${createdOrders.length} order(s) created` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET buyer orders
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    const isBuyer = req.user.role === 'buyer';
    const isSeller = req.user.role === 'seller';

    let query = supabaseAdmin
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' });

    if (isBuyer) query = query.eq('buyer_id', req.user.userId);
    else if (isSeller) query = query.eq('seller_id', req.user.userId);

    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data: orders, error, count } = await query;
    if (error) throw error;
    res.json({ success: true, orders: orders || [], total: count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single order with tracking
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, listings(id, title, images)), order_tracking(*)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;

    if (req.user.role !== 'admin' && order.buyer_id !== req.user.userId && order.seller_id !== req.user.userId)
      return res.status(403).json({ success: false, error: 'Not authorized' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH update order status (seller/admin)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, description, location, tracking_number, carrier } = req.body;

    const VALID_TRANSITIONS = {
      pending: ['paid', 'cancelled'],
      paid: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['completed', 'returned'],
      completed: [],
      cancelled: [],
      returned: ['refunded'],
      refunded: [],
    };

    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('orders').select('status, seller_id, buyer_id').eq('id', req.params.id).single();
    if (fetchErr || !order) return res.status(404).json({ success: false, error: 'Order not found' });

    if (req.user.role !== 'admin') {
      if (req.user.role === 'seller' && order.seller_id !== req.user.userId)
        return res.status(403).json({ success: false, error: 'Not authorized' });
      if (req.user.role === 'buyer' && order.buyer_id !== req.user.userId)
        return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const allowed = VALID_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, error: `Cannot transition from ${order.status} to ${status}` });

    const updateData = { status, updated_at: new Date().toISOString() };
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString();
    if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancellation_reason = description || 'Cancelled';
    }

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('orders').update(updateData).eq('id', req.params.id).select().single();
    if (updateErr) throw updateErr;

    // Add tracking entry
    await supabaseAdmin.from('order_tracking').insert({
      order_id: req.params.id,
      status,
      description: description || `Order status updated to ${status}`,
      location: location || null,
      tracking_number: tracking_number || null,
      carrier: carrier || null,
      created_by: req.user.userId,
    });

    res.json({ success: true, order: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
