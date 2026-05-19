const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (userId, role, tenantId) => {
  return jwt.sign(
    { userId, role, tenantId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
const registerUser = async (email, password, role, phone = null) => {
  try {
    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        role,
        phone,
        tenant_id: email, // Using email as tenant_id for simplicity
      })
      .select()
      .single();

    if (error) throw error;

    // Create role-specific profile
    if (role === 'seller') {
      await supabaseAdmin.from('sellers').insert({
        id: user.id,
        tenant_id: user.tenant_id,
      });
    } else if (role === 'buyer') {
      await supabaseAdmin.from('buyers').insert({
        id: user.id,
        tenant_id: user.tenant_id,
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role, user.tenant_id);

    return { user, token };
  } catch (error) {
    throw error;
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    // Get user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id, user.role, user.tenant_id);

    return { user, token };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generateOTP,
  registerUser,
  loginUser,
};
