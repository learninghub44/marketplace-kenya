const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../lib/auth');
const { supabaseAdmin } = require('../config/supabase');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, phone } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const { user, token } = await registerUser(email, password, role, phone);

    res.json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const { user, token } = await loginUser(email, password);

    res.json({ success: true, user, token });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
