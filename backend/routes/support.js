const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/tickets', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*, responses:support_responses(*)')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, tickets: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/tickets', authenticate, async (req, res) => {
  try {
    const { subject, message, priority = 'medium' } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, error: 'Subject and message are required' });
    }

    const { data: user, error: userError } = await supabaseAdmin.from('users').select('tenant_id').eq('id', req.user.userId).single();
    if (userError) throw userError;

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({ user_id: req.user.userId, subject, message, priority, tenant_id: user.tenant_id })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, ticket: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/tickets/:id/respond', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    const { id } = req.params;
    const { data: ticket, error: ticketError } = await supabaseAdmin.from('support_tickets').select('*').eq('id', id).single();
    if (ticketError || !ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    if (ticket.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { data, error } = await supabaseAdmin.from('support_responses').insert({
      ticket_id: id,
      user_id: req.user.userId,
      message,
      is_admin: req.user.role === 'admin'
    }).select().single();

    if (error) throw error;
    res.json({ success: true, response: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
