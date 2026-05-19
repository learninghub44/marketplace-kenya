import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateCallback } from '@/lib/payhero'

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json()

    if (!validateCallback(callbackData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid callback data' },
        { status: 400 }
      )
    }

    const { checkoutRequestID, resultCode, resultDesc } = callbackData

    // Find payment by transaction_id
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('transaction_id', checkoutRequestID)
      .single()

    if (error || !payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Update payment status
    const status = resultCode === '0' ? 'completed' : 'failed'
    
    await supabaseAdmin
      .from('payments')
      .update({
        status,
        callback_data: callbackData,
      })
      .eq('id', payment.id)

    // If payment successful, activate subscription
    if (status === 'completed' && payment.callback_data?.package_type) {
      const package_type = payment.callback_data.package_type

      // Get package details
      const { data: packageData } = await supabaseAdmin
        .from('packages')
        .select('*')
        .eq('type', package_type)
        .single()

      if (packageData) {
        const expires_at = new Date()
        expires_at.setDate(expires_at.getDate() + packageData.duration_days)

        // Create or update subscription
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            seller_id: payment.user_id,
            package_id: packageData.id,
            package_type,
            status: 'active',
            starts_at: new Date().toISOString(),
            expires_at: expires_at.toISOString(),
            payment_id: payment.id,
            tenant_id: payment.tenant_id,
          })

        // Update seller's package
        await supabaseAdmin
          .from('sellers')
          .update({
            package_type,
            subscription_expires_at: expires_at.toISOString(),
          })
          .eq('id', payment.user_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
