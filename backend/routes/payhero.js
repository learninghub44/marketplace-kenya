const express = require('express');
const router = express.Router();
const { initiateSTKPush, validateCallback } = require('../lib/payhero');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// STK Push
router.post('/stk', authenticate, async (req, res) => {
  try {
    const { phone, amount, package_type } = req.body;
    const userId = req.user.userId;

    if (!phone || !amount || !package_type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        amount,
        status: 'pending',
        payment_method: 'mpesa',
        package_type,
        tenant_id: req.user.tenantId,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Initiate STK Push
    const payheroResponse = await initiateSTKPush(
      phone,
      amount,
      payment.id
    );

    // Update payment with transaction ID
    await supabaseAdmin
      .from('payments')
      .update({ transaction_id: payheroResponse.transaction_id })
      .eq('id', payment.id);

    res.json({
      success: true,
      message: 'STK Push sent successfully',
      payment_id: payment.id,
      transaction_id: payheroResponse.transaction_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Callback
router.post('/callback', async (req, res) => {
  try {
    const data = req.body;

    console.log('PAYMENT CALLBACK:', data);

    // Validate callback
    if (!validateCallback(data)) {
      return res.status(400).json({ success: false, error: 'Invalid callback data' });
    }

    // Find payment by external reference
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', data.external_reference)
      .single();

    if (error || !payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    // Update payment status
    const status = data.status === 'success' ? 'completed' : 'failed';
    await supabaseAdmin
      .from('payments')
      .update({
        status,
        callback_data: data,
      })
      .eq('id', payment.id);

    // If successful and it's a package subscription
    if (status === 'completed' && payment.package_type) {
      const { data: seller } = await supabaseAdmin
        .from('sellers')
        .select('*')
        .eq('id', payment.user_id)
        .single();

      if (seller) {
        // Calculate expiry date (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await supabaseAdmin
          .from('sellers')
          .update({
            package_type: payment.package_type,
            subscription_expires_at: expiresAt.toISOString(),
          })
          .eq('id', payment.user_id);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
