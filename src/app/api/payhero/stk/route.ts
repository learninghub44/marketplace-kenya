import { NextRequest, NextResponse } from 'next/server'
import { initiateSTKPush } from '@/lib/payhero'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

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
    const { phone, amount, package_type } = body

    if (!phone || !amount || !package_type) {
      return NextResponse.json(
        { success: false, error: 'Phone, amount, and package type are required' },
        { status: 400 }
      )
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: decoded.userId,
        amount,
        method: 'mpesa',
        status: 'pending',
        phone,
        callback_data: { package_type },
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json(
        { success: false, error: paymentError.message },
        { status: 500 }
      )
    }

    // Initiate STK Push
    const result = await initiateSTKPush({
      phone,
      amount,
      account_reference: payment.id,
      transaction_desc: `Package Subscription - ${package_type}`,
    })

    if (result.success) {
      // Update payment with checkout request ID
      await supabaseAdmin
        .from('payments')
        .update({ transaction_id: result.checkoutRequestID })
        .eq('id', payment.id)

      return NextResponse.json({
        success: true,
        payment_id: payment.id,
        checkoutRequestID: result.checkoutRequestID,
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
