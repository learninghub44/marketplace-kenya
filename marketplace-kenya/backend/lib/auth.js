const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

const hashPassword = async (password) => bcrypt.hash(password, await bcrypt.genSalt(10));

const verifyPassword = async (password, hash) => {
  if (!hash) throw new Error('No password set for this account');
  return bcrypt.compare(password, hash);
};

const generateToken = (userId, role, tenantId) =>
  jwt.sign({ userId, role, tenantId }, JWT_SECRET, { expiresIn: '7d' });

const verifyToken = (token) => {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
};

const registerUser = async (email, password, role, phone = null) => {
  // Check existing
  const { data: existing } = await supabaseAdmin
    .from('users').select('id').eq('email', email).maybeSingle();
  if (existing) throw new Error('An account with this email already exists. Please log in instead.');

  const password_hash = await hashPassword(password);

  // DO NOT pass tenant_id — let DB DEFAULT (uuid_generate_v4()) generate it
  // Passing our own UUID triggers users_tenant_id_fkey FK check against tenants table
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert({ email, password_hash, role, phone: phone || null })
    .select('id,email,role,phone,tenant_id,created_at')
    .single();

  if (error) {
    console.error('Register error:', error.code, error.message, error.details);
    // Give user a friendly message
    if (error.code === '23505') throw new Error('An account with this email already exists.');
    if (error.message?.includes('tenant_id')) throw new Error('Database setup issue. Please contact support.');
    throw new Error(error.message || 'Could not create account. Please try again.');
  }

  // Role-specific profile — DO NOT pass tenant_id (let FK propagate naturally)
  if (role === 'seller') {
    const { error: se } = await supabaseAdmin
      .from('sellers').insert({ id: user.id, tenant_id: user.tenant_id });
    if (se) console.warn('Seller profile warning (non-fatal):', se.message);
  } else if (role === 'buyer') {
    const { error: be } = await supabaseAdmin
      .from('buyers').insert({ id: user.id, tenant_id: user.tenant_id });
    if (be) console.warn('Buyer profile warning (non-fatal):', be.message);
  }

  return { user, token: generateToken(user.id, user.role, user.tenant_id) };
};

const loginUser = async (email, password) => {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id,email,role,phone,tenant_id,created_at,password_hash')
    .eq('email', email)
    .maybeSingle();

  if (!user) throw new Error('Invalid email or password');
  if (!(await verifyPassword(password, user.password_hash)))
    throw new Error('Invalid email or password');

  const { password_hash, ...safe } = user;
  return { user: safe, token: generateToken(user.id, user.role, user.tenant_id) };
};

module.exports = { hashPassword, verifyPassword, generateToken, verifyToken, registerUser, loginUser };
