import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(url, anon)

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = serviceKey
  ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  : supabase

export async function getListings(opts: {
  category?: string; search?: string; limit?: number; featured?: boolean
} = {}) {
  let q = supabase
    .from('listings')
    .select('id,title,price,category,location,images,status,featured,views,created_at,seller_id,sellers:users!seller_id(id,name,phone,avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(opts.limit || 20)
  if (opts.category) q = q.eq('category', opts.category)
  if (opts.search) q = q.ilike('title', `%${opts.search}%`)
  if (opts.featured) q = q.eq('featured', true)
  const { data, error } = await q
  return { listings: data || [], error }
}

export async function getListing(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*,sellers:users!seller_id(id,name,phone,avatar_url,email)')
    .eq('id', id).single()
  return { listing: data, error }
}
