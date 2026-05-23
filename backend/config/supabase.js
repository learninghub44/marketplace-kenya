const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Node.js 20 lacks native WebSocket — must pass ws package as transport
const wsOptions = {
  realtime: {
    transport: ws,
  },
};

// Client for general operations
const supabase = createClient(supabaseUrl, supabaseAnonKey, wsOptions);

// Admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  ...wsOptions,
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = { supabase, supabaseAdmin };
