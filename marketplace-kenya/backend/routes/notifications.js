const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// Get notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark notifications as read
router.put('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notification_ids, read } = req.body;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read })
      .in('id', notification_ids)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
