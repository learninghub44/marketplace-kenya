import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sellerId = searchParams.get('seller_id')

    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (sellerId) {
      query = query.eq('seller_id', sellerId)
    }

    const { data: listings, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, listings })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, price, category, location, images, seo_tags, hashtags } = body

    if (!title || !description || !price || !category || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check seller's package limits
    const { data: seller } = await supabaseAdmin
      .from('sellers')
      .select('*, package_type')
      .eq('id', decoded.userId)
      .single()

    if (seller?.package_type === 'starter') {
      const { count } = await supabaseAdmin
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', decoded.userId)

      if (count && count >= 10) {
        return NextResponse.json(
          { success: false, error: 'Listing limit reached. Upgrade your package.' },
          { status: 400 }
        )
      }
    } else if (seller?.package_type === 'business') {
      const { count } = await supabaseAdmin
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', decoded.userId)

      if (count && count >= 50) {
        return NextResponse.json(
          { success: false, error: 'Listing limit reached. Upgrade to Premium.' },
          { status: 400 }
        )
      }
    }

    const { data: listing, error } = await supabaseAdmin
      .from('listings')
      .insert({
        seller_id: decoded.userId,
        title,
        description,
        price,
        category,
        location,
        images: images || [],
        seo_tags: seo_tags || [],
        hashtags: hashtags || [],
        status: 'pending',
        tenant_id: seller?.tenant_id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
