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
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get all stats in parallel
    const [
      usersResult,
      sellersResult,
      buyersResult,
      listingsResult,
      pendingListingsResult,
      activeListingsResult,
      reportsResult,
      ticketsResult,
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('sellers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('buyers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    ])
    const stats = {
      totalUsers: usersResult.count || 0,
      totalSellers: sellersResult.count || 0,
      totalBuyers: buyersResult.count || 0,
      totalListings: listingsResult.count || 0,
      pendingListings: pendingListingsResult.count || 0,
      activeListings: activeListingsResult.count || 0,
      totalRevenue: 0,
      reports: reportsResult.count || 0,
      openTickets: ticketsResult.count || 0,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
