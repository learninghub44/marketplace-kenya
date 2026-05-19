import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listing_id')
    const otherUserId = searchParams.get('other_user_id')

    let query = supabaseAdmin
      .from('messages')
      .select('*, sender:users!sender_id(*), receiver:users!receiver_id(*)')
      .or(`sender_id.eq.${decoded.userId},receiver_id.eq.${decoded.userId}`)
      .order('created_at', { ascending: false })

    if (listingId) {
      query = query.eq('listing_id', listingId)
    }

    if (otherUserId) {
      query = query.or(`and(sender_id.eq.${decoded.userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${decoded.userId})`)
    }

    const { data: messages, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, messages })
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
    const { receiver_id, listing_id, content, image_url } = body

    if (!receiver_id || !content) {
      return NextResponse.json(
        { success: false, error: 'Receiver ID and content are required' },
        { status: 400 }
      )
    }

    // Get user's tenant_id
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('tenant_id')
      .eq('id', decoded.userId)
      .single()

    const { data: message, error } = await supabaseAdmin
      .from('messages')
      .insert({
        sender_id: decoded.userId,
        receiver_id,
        listing_id,
        content,
        image_url,
        tenant_id: user?.tenant_id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Create notification for receiver
    await supabaseAdmin.from('notifications').insert({
      user_id: receiver_id,
      type: 'message',
      title: 'New Message',
      message: `You have a new message`,
      data: { message_id: message.id },
      tenant_id: user?.tenant_id,
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
