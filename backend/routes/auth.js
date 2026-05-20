const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { registerUser, loginUser, hashPassword } = require('../lib/auth');
const { supabaseAdmin } = require('../config/supabase');

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, phone } = req.body;
    if (!email || !password || !role) return res.status(400).json({ success: false, error: 'Missing required fields' });
    const { user, token } = await registerUser(email, password, role, phone);
    res.json({ success: true, user, token });
  } catch (error) { res.status(400).json({ success: false, error: error.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
    const { user, token } = await loginUser(email, password);
    res.json({ success: true, user, token });
  } catch (error) { res.status(401).json({ success: false, error: error.message }); }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    if (user) await supabaseAdmin.from('password_resets').insert({ user_id: user.id, token, expires_at: expiresAt });
    res.json({ success: true, message: 'If your email exists, a password reset link has been sent.' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, error: 'Token and password are required' });
    const { data: reset } = await supabaseAdmin.from('password_resets').select('*').eq('token', token).is('used_at', null).single();
    if (!reset || new Date(reset.expires_at) < new Date()) return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    const hashed = await hashPassword(password);
    await supabaseAdmin.from('users').update({ password: hashed }).eq('id', reset.user_id);
    await supabaseAdmin.from('password_resets').update({ used_at: new Date().toISOString() }).eq('id', reset.id);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.post('/logout', (req, res) => res.json({ success: true, message: 'Logged out successfully' }));

module.exports = router;
