const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');
const { Resend } = require('resend');
const { hashPassword } = require('../lib/auth');

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://marketplace-kenya.pages.dev';

const adminAuth = [authenticate, authorize('admin')];

// ── Stats ──────────────────────────────────────────────────────────────────
router.get('/stats', ...adminAuth, async (req, res) => {
  try {
    const [u, l, lp, la, r, t] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    ]);
    res.json({ success: true, stats: {
      totalUsers: u.count || 0, totalListings: l.count || 0,
      pendingListings: lp.count || 0, activeListings: la.count || 0,
      reports: r.count || 0, openTickets: t.count || 0,
    }});
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Users ──────────────────────────────────────────────────────────────────
router.get('/users', ...adminAuth, async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users').select('id,email,name,role,phone,created_at,banned,ban_reason').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, users });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.delete('/users/:id', ...adminAuth, async (req, res) => {
  try {
    // Don't allow deleting yourself
    if (req.params.id === req.user.userId)
      return res.status(400).json({ success: false, error: 'Cannot delete your own admin account' });
    await supabaseAdmin.from('users').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.put('/users/:id/role', ...adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['buyer','seller','admin'].includes(role))
      return res.status(400).json({ success: false, error: 'Invalid role' });
    const { error } = await supabaseAdmin.from('users').update({ role }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Listings ──────────────────────────────────────────────────────────────
router.get('/listings', ...adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let q = supabaseAdmin.from('listings')
      .select('id,title,price,category,location,status,created_at,seller_id,description')
      .order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data: listings, error } = await q;
    if (error) throw error;
    res.json({ success: true, listings: listings || [] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/listings/:id/approve', ...adminAuth, async (req, res) => {
  try {
    const { data: listing } = await supabaseAdmin.from('listings')
      .select('title,seller_id').eq('id', req.params.id).single();
    await supabaseAdmin.from('listings').update({ status: 'active' }).eq('id', req.params.id);
    // Email seller
    if (listing?.seller_id) {
      const { data: su } = await supabaseAdmin.from('users').select('email').eq('id', listing.seller_id).maybeSingle();
      if (su?.email) {
        resend.emails.send({
          from: 'Sokoni Kenya <noreply@sokonikenya.co.ke>',
          to: su.email,
          subject: '✅ Your listing is now live!',
          html: `<div style="font-family:sans-serif;padding:24px;max-width:600px"><h2 style="color:#16a34a">🎉 Listing Approved!</h2><p>Your listing <strong>"${listing.title}"</strong> is now live on Sokoni Kenya.</p><a href="${FRONTEND_URL}/listings" style="background:#f97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">View Live Listings →</a></div>`
        }).catch(() => {});
      }
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/listings/:id/reject', ...adminAuth, async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const { data: listing } = await supabaseAdmin.from('listings')
      .select('title,seller_id').eq('id', req.params.id).single();
    await supabaseAdmin.from('listings').update({ status: 'rejected' }).eq('id', req.params.id);
    if (listing?.seller_id) {
      const { data: su } = await supabaseAdmin.from('users').select('email').eq('id', listing.seller_id).maybeSingle();
      if (su?.email) {
        resend.emails.send({
          from: 'Sokoni Kenya <noreply@sokonikenya.co.ke>',
          to: su.email,
          subject: '❌ Listing needs changes',
          html: `<div style="font-family:sans-serif;padding:24px;max-width:600px"><h2 style="color:#dc2626">Listing Not Approved</h2><p>Your listing <strong>"${listing.title}"</strong> was not approved.${reason ? `<br><br><strong>Reason:</strong> ${reason}` : ''}</p><p>Please review our guidelines and resubmit.</p><a href="${FRONTEND_URL}/seller" style="background:#1f2937;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">Go to Dashboard →</a></div>`
        }).catch(() => {});
      }
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.delete('/listings/:id', ...adminAuth, async (req, res) => {
  try {
    await supabaseAdmin.from('listings').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Support Tickets ────────────────────────────────────────────────────────
router.get('/tickets', ...adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let q = supabaseAdmin.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data: tickets, error } = await q;
    if (error) throw error;
    res.json({ success: true, tickets: tickets || [] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/tickets/:id/close', ...adminAuth, async (req, res) => {
  try {
    await supabaseAdmin.from('support_tickets').update({ status: 'closed' }).eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Reports ────────────────────────────────────────────────────────────────
router.get('/reports', ...adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let q = supabaseAdmin.from('reports').select('*').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data: reports, error } = await q;
    if (error) throw error;
    res.json({ success: true, reports: reports || [] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/reports/:id/resolve', ...adminAuth, async (req, res) => {
  try {
    await supabaseAdmin.from('reports').update({ status: 'resolved' }).eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;

// ── Ban / Unban ────────────────────────────────────────────────────────────
router.post('/users/:id/ban', ...adminAuth, async (req, res) => {
  try {
    const { reason = 'Violation of terms' } = req.body;
    if (req.params.id === req.user.userId)
      return res.status(400).json({ success: false, error: 'Cannot ban yourself' });
    const { data: u } = await supabaseAdmin.from('users').select('email,role').eq('id', req.params.id).single();
    if (!u || u.role === 'admin')
      return res.status(400).json({ success: false, error: 'Cannot ban this user' });
    await supabaseAdmin.from('users').update({ banned: true, ban_reason: reason }).eq('id', req.params.id);
    await supabaseAdmin.from('listings').update({ status: 'suspended' }).eq('seller_id', req.params.id);
    if (u.email) {
      resend.emails.send({
        from: 'Sokoni Kenya <noreply@sokonikenya.co.ke>',
        to: u.email,
        subject: 'Your Sokoni Kenya account has been suspended',
        html: `<div style="font-family:sans-serif;padding:24px;max-width:600px"><h2 style="color:#dc2626">Account Suspended</h2><p>Your account has been suspended.</p><p><strong>Reason:</strong> ${reason}</p><p>Contact our support team to appeal.</p></div>`,
      }).catch(() => {});
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/users/:id/unban', ...adminAuth, async (req, res) => {
  try {
    await supabaseAdmin.from('users').update({ banned: false, ban_reason: null }).eq('id', req.params.id);
    await supabaseAdmin.from('listings').update({ status: 'active' }).eq('seller_id', req.params.id).eq('status', 'suspended');
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Feature listing ────────────────────────────────────────────────────────
router.post('/listings/:id/feature', ...adminAuth, async (req, res) => {
  try {
    const { featured } = req.body;
    await supabaseAdmin.from('listings').update({ featured }).eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── All listings (any status) ──────────────────────────────────────────────
router.get('/all-listings', ...adminAuth, async (req, res) => {
  try {
    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select('id,title,status,price,category,location,created_at,seller_id,featured,views')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    res.json({ success: true, listings: listings || [] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Revenue ────────────────────────────────────────────────────────────────
router.get('/revenue', ...adminAuth, async (req, res) => {
  try {
    const { data: payments } = await supabaseAdmin
      .from('orders')
      .select('total_amount,status,created_at')
      .in('status', ['paid', 'delivered', 'completed'])
      .order('created_at', { ascending: false });
    const all = payments || [];
    const total = all.reduce((s, p) => s + Number(p.total_amount || 0), 0);
    const now = new Date();
    const thisMonth = all
      .filter(p => new Date(p.created_at).getMonth() === now.getMonth() && new Date(p.created_at).getFullYear() === now.getFullYear())
      .reduce((s, p) => s + Number(p.total_amount || 0), 0);
    res.json({ success: true, revenue: { total, thisMonth, transactions: all.length, recent: all.slice(0, 10) } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Ticket reply ───────────────────────────────────────────────────────────
router.post('/tickets/:id/reply', ...adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message required' });
    const { data: ticket } = await supabaseAdmin
      .from('support_tickets').select('subject,user_id').eq('id', req.params.id).single();
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    await supabaseAdmin.from('support_responses').insert({
      ticket_id: req.params.id, user_id: req.user.userId, message, is_admin: true
    });
    await supabaseAdmin.from('support_tickets').update({ status: 'in_progress' }).eq('id', req.params.id);
    if (ticket.user_id) {
      const { data: user } = await supabaseAdmin.from('users').select('email').eq('id', ticket.user_id).single();
      if (user?.email) {
        resend.emails.send({
          from: 'Sokoni Kenya Support <noreply@sokonikenya.co.ke>',
          to: user.email,
          subject: `Re: ${ticket.subject}`,
          html: `<div style="font-family:sans-serif;padding:24px;max-width:600px"><h3>Reply from Sokoni Kenya Support</h3><p>${message}</p><hr/><p style="color:#888;font-size:12px">Subject: ${ticket.subject}</p></div>`,
        }).catch(() => {});
      }
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/tickets/:id/replies', ...adminAuth, async (req, res) => {
  try {
    const { data: replies } = await supabaseAdmin
      .from('support_responses').select('*').eq('ticket_id', req.params.id).order('created_at');
    res.json({ success: true, replies: replies || [] });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
