const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { createNotification } = require('../lib/notifications');

// Get messages
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listing_id, other_user_id } = req.query;

    let query = supabaseAdmin
      .from('messages')
      .select('*, sender:users!sender_id(*), receiver:users!receiver_id(*)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (listing_id) query = query.eq('listing_id', listing_id);
    if (other_user_id) query = query.or(`and(sender_id.eq.${userId},receiver_id.eq.${other_user_id}),and(sender_id.eq.${other_user_id},receiver_id.eq.${userId})`);

    const { data: messages, error } = await query;

    if (error) throw error;

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { receiver_id, listing_id, content } = req.body;

    if (!receiver_id || !content) {
      return res.status(400).json({ success: false, error: 'Receiver and content required' });
    }

    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert({
        sender_id: userId,
        receiver_id,
        listing_id,
        content,
        tenant_id: req.user.tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for receiver
    await createNotification({
      user_id: receiver_id,
      type: 'message',
      title: 'New Message',
      message: `You have a new message`,
      data: { message_id: message.id },
      tenant_id: req.user.tenantId,
    });

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
