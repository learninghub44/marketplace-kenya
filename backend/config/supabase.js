const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for general operations
const clientOptions = {
  realtime: {
    transport: ws,
  },
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, clientOptions);

// Admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, clientOptions);

module.exports = { supabase, supabaseAdmin };
