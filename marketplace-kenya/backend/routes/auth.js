const express = require('express');
const router = express.Router();
const { registerUser, loginUser, hashPassword } = require('../lib/auth');
const { supabaseAdmin } = require('../config/supabase');
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Seed admin on first run ───────────────────────────────────────────────
const ensureAdmin = async () => {
  try {
    const adminEmail = 'chrisotieno026@gmail.com';
    const { data: existing } = await supabaseAdmin.from('users').select('id').eq('email', adminEmail).maybeSingle();
    if (!existing) {
      const bcryptLib = require('bcryptjs');
      const password_hash = await bcryptLib.hash('Facebook@2025', 10);
      // Don't pass tenant_id — let DB DEFAULT generate it
      const { data, error } = await supabaseAdmin.from('users')
        .insert({ email: adminEmail, password_hash, role: 'admin', phone: '+254701059192' })
        .select().single();
      if (error) console.error('Admin seed error:', error.message);
      else console.log('✅ Admin created:', adminEmail);
    } else { console.log('✅ Admin already exists'); }
  } catch(e) { console.error('Admin seed failed:', e.message); }
};
ensureAdmin();

// ─── Register ──────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, phone, name } = req.body;
    if (!email || !password || !role) return res.status(400).json({ success: false, error: 'Missing required fields' });
    if (role === 'admin') return res.status(403).json({ success: false, error: 'Cannot self-register as admin' });

    const { user, token } = await registerUser(email, password, role, phone, name);

    // Welcome email
    try {
      await resend.emails.send({
        from: 'Sokoni Kenya <noreply@kenyamarketplace.co.ke>',
        to: email,
        subject: '🎉 Welcome to Sokoni Kenya!',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:linear-gradient(135deg,#1f2937,#374151);padding:32px;text-align:center">
              <h1 style="color:#f97316;margin:0;font-size:28px">🛒 Sokoni Kenya</h1>
              <p style="color:#9ca3af;margin:8px 0 0">Kenya's trusted local marketplace</p>
            </div>
            <div style="padding:32px">
              <h2 style="color:#1f2937">Welcome, ${name || email.split('@')[0]}! 🎉</h2>
              <p style="color:#6b7280">Your account has been created successfully as a <strong>${role}</strong>.</p>
              <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:24px 0">
                <p style="margin:0;color:#374151">📧 Email: <strong>${email}</strong></p>
                <p style="margin:8px 0 0;color:#374151">👤 Role: <strong>${role.charAt(0).toUpperCase()+role.slice(1)}</strong></p>
              </div>
              <a href="${FRONTEND_URL}/login" style="display:inline-block;background:#f97316;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Start ${role === 'seller' ? 'Selling' : 'Shopping'} →</a>
              <p style="color:#9ca3af;font-size:12px;margin-top:32px">Sokoni Kenya · Free for everyone 🇰🇪</p>
            </div>
          </div>`,
      });
    } catch (emailErr) { console.error('Welcome email failed:', emailErr.message); }

    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Login ─────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
    const { user, token } = await loginUser(email, password);
    res.json({ success: true, user, token });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// ─── Logout ────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => res.json({ success: true }));

// ─── Forgot Password ───────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });

    const { data: user } = await supabaseAdmin.from('users').select('id,email').eq('email', email).single();
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const resetToken = jwt.sign({ userId: user.id, type: 'password_reset' }, JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: 'Sokoni Kenya <noreply@kenyamarketplace.co.ke>',
      to: email,
      subject: '🔐 Reset your password – Sokoni Kenya',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
          <div style="background:linear-gradient(135deg,#1f2937,#374151);padding:32px;text-align:center">
            <h1 style="color:#f97316;margin:0">🔐 Password Reset</h1>
          </div>
          <div style="padding:32px">
            <h2 style="color:#1f2937">Reset your password</h2>
            <p style="color:#6b7280">We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">Reset Password →</a>
            <p style="color:#9ca3af;font-size:12px">If you didn't request this, ignore this email. Your password won't change.</p>
          </div>
        </div>`,
    });

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Reset Password ────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, error: 'Token and password required' });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'password_reset') return res.status(400).json({ success: false, error: 'Invalid token' });

    const newHash = await hashPassword(password);
    const { error } = await supabaseAdmin.from('users').update({ password_hash: newHash }).eq('id', decoded.userId);
    if (error) throw error;

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(400).json({ success: false, error: 'Reset link expired. Please request a new one.' });
    res.status(400).json({ success: false, error: 'Invalid or expired token' });
  }
});

// ─── Support ticket (public) ───────────────────────────────────────────────
router.post('/support', async (req, res) => {
  try {
    const { name, email, subject, message, priority = 'medium' } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ success: false, error: 'All fields required' });

    // Find or use a system user for anonymous tickets
    const { data: sysUser } = await supabaseAdmin.from('users').select('id,tenant_id').eq('role','admin').maybeSingle();
    if (!sysUser) throw new Error('System not ready. Please try again later.');
    const { data: ticket, error } = await supabaseAdmin.from('support_tickets').insert({
      subject, message, priority, status: 'open',
      user_id: sysUser.id, tenant_id: sysUser.tenant_id,
    }).select().single();
    if (error) throw error;

    // Notify support team
    try {
      await resend.emails.send({
        from: 'Sokoni Kenya <noreply@kenyamarketplace.co.ke>',
        to: 'chrisotieno026@gmail.com',
        subject: `🎫 New Support Ticket: ${subject}`,
        html: `<div style="font-family:sans-serif;padding:24px"><h2>New Support Ticket</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Priority:</strong> ${priority}</p><p><strong>Message:</strong></p><p style="background:#f9fafb;padding:16px;border-radius:8px">${message}</p></div>`,
      });
      // Confirm to user
      await resend.emails.send({
        from: 'Sokoni Kenya <noreply@kenyamarketplace.co.ke>',
        to: email,
        subject: '✅ We received your support request',
        html: `<div style="font-family:sans-serif;padding:24px"><h2>Hi ${name},</h2><p>We've received your support request and will respond within 24 hours.</p><p><strong>Subject:</strong> ${subject}</p><p>WhatsApp us for urgent help: <strong>0742 791 838</strong></p></div>`,
      });
    } catch (emailErr) { console.error('Support email failed:', emailErr.message); }

    res.json({ success: true, ticketId: ticket?.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Get current user ──────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const { data: user } = await supabaseAdmin.from('users').select('id,email,role,phone,name').eq('id', decoded.userId).single();
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (e) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

module.exports = router;
