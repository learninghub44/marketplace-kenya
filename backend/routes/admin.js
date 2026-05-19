const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// Get stats
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [
      usersResult,
      sellersResult,
      buyersResult,
      listingsResult,
      pendingListingsResult,
      activeListingsResult,
      reportsResult,
      ticketsResult,
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('sellers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('buyers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    ]);
    const stats = {
      totalUsers: usersResult.count || 0,
      totalSellers: sellersResult.count || 0,
      totalBuyers: buyersResult.count || 0,
      totalListings: listingsResult.count || 0,
      pendingListings: pendingListingsResult.count || 0,
      activeListings: activeListingsResult.count || 0,
      totalRevenue: 0,
      reports: reportsResult.count || 0,
      openTickets: ticketsResult.count || 0,
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get listings
router.get('/listings', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabaseAdmin
      .from('listings')
      .select('*, sellers(*)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: listings, error } = await query;

    if (error) throw error;

    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve listing
router.post('/listings/:id/approve', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('listings')
      .update({ status: 'active' })
      .eq('id', id);

    if (error) throw error;

    // Log action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: req.user.userId,
      action: 'approve_listing',
      entity: 'listings',
      entity_id: id,
      tenant_id: req.user.tenantId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject listing
router.post('/listings/:id/reject', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('listings')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) throw error;

    // Log action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: req.user.userId,
      action: 'reject_listing',
      entity: 'listings',
      entity_id: id,
      tenant_id: req.user.tenantId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reports
router.get('/reports', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabaseAdmin
      .from('reports')
      .select('*, reporter:users!reporter_id(*), reported_user:users!reported_user_id(*), reported_listing:listings(*)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: reports, error } = await query;

    if (error) throw error;

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get tickets
router.get('/tickets', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*, user:users(*)')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data: tickets, error } = await query;

    if (error) throw error;

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
