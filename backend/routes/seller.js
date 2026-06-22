const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// Get seller profile
router.get('/profile', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: seller, error } = await supabaseAdmin
      .from('sellers')
      .select('*, users(*)')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update seller profile
router.put('/profile', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { business_name, business_description, phone } = req.body;

    const { data: seller, error } = await supabaseAdmin
      .from('sellers')
      .update({
        business_name,
        business_description,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Update phone in users table if provided
    if (phone) {
      await supabaseAdmin
        .from('users')
        .update({ phone })
        .eq('id', userId);
    }

    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get seller's listings
router.get('/listings', authenticate, authorize('seller'), async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: listings, error } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.get("/kyc-status", authenticate, authorize("seller","admin"), async (req, res) => {
  try {
    const { data: s } = await supabaseAdmin.from("sellers").select("kyc_status").eq("id", req.user.userId).maybeSingle();
    res.json({ success: true, status: s?.kyc_status || "not_started" });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Didit v3 API (https://docs.didit.me) — previously this called the deprecated
// v2 OAuth endpoints (apx.didit.me/auth/v2/token, apx.didit.me/v2/sessions),
// which is not the current integration surface. v3 uses a single x-api-key
// header plus a workflow_id instead of client_id/client_secret + OAuth.
router.post("/kyc-start", authenticate, authorize("seller","admin"), async (req, res) => {
  try {
    const API_KEY = process.env.DIDIT_API_KEY;
    const WORKFLOW_ID = process.env.DIDIT_WORKFLOW_ID;
    const CALLBACK_URL = process.env.DIDIT_CALLBACK_URL || "https://marketplace-kenya.pages.dev/seller/kyc";

    if (!API_KEY || !WORKFLOW_ID) {
      // No Didit credentials configured — demo mode. NOTE: this can never
      // resolve to "approved" on its own since no real session/webhook
      // exists. Useful for local frontend dev only, not for production.
      await supabaseAdmin.from("sellers").update({ kyc_status: "pending" }).eq("id", req.user.userId);
      return res.json({ success: true, verification_url: "https://verify.didit.me?demo=true", demo: true });
    }

    const sessionRes = await fetch("https://verification.didit.me/v3/session/", {
      method: "POST",
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ workflow_id: WORKFLOW_ID, vendor_data: req.user.userId, callback: CALLBACK_URL }),
    }).then(r => r.json());

    if (!sessionRes.session_id || !sessionRes.url) {
      return res.status(500).json({ success: false, error: sessionRes.message || "Could not start Didit verification session" });
    }

    await supabaseAdmin.from("sellers").update({ kyc_status: "pending", kyc_session_id: sessionRes.session_id }).eq("id", req.user.userId);
    res.json({ success: true, verification_url: sessionRes.url });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Verifies Didit's X-Signature-Simple header before trusting a status update.
// Without this, anyone could POST { vendor_data: <their own user id>, status:
// "Approved" } to this endpoint and self-approve without ever completing
// real identity verification — which would make the listing-creation gate
// that depends on kyc_status meaningless.
// Reference: https://docs.didit.me/integration/webhooks
const verifyDiditSignature = (req) => {
  const secret = process.env.DIDIT_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('DIDIT_WEBHOOK_SECRET not set — accepting KYC webhook WITHOUT signature verification. Set this in production.');
    return true;
  }
  const signature = req.headers['x-signature-simple'];
  const timestamp = req.headers['x-timestamp'];
  if (!signature || !timestamp) return false;

  const incomingTime = parseInt(timestamp, 10);
  if (!Number.isFinite(incomingTime) || Math.abs(Math.floor(Date.now() / 1000) - incomingTime) > 300) return false; // reject stale/replayed deliveries

  const body = req.body || {};
  const canonical = [body.timestamp || '', body.session_id || '', body.status || '', body.webhook_type || ''].join(':');
  const expected = crypto.createHmac('sha256', secret).update(canonical).digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
};

router.post("/kyc-webhook", async (req, res) => {
  try {
    if (!verifyDiditSignature(req)) {
      return res.status(401).json({ error: "Invalid or missing webhook signature" });
    }

    const { vendor_data: userId, status } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing vendor_data" });

    // v3 statuses are Title Case ("Approved", "Declined", ...) — normalize.
    const normalized = String(status || '').toLowerCase();
    const kycStatus = normalized === "approved" ? "approved" : normalized === "declined" ? "rejected" : "pending";

    await supabaseAdmin.from("sellers").update({ kyc_status: kycStatus, kyc_verified_at: kycStatus === "approved" ? new Date().toISOString() : null }).eq("id", userId);
    const { data: u } = await supabaseAdmin.from("users").select("email,name").eq("id", userId).maybeSingle();
    if (u?.email && kycStatus !== "pending") resend.emails.send({ from: "Sokoni Kenya <noreply@sokonikenya.co.ke>", to: u.email, subject: kycStatus === "approved" ? "Your seller account is verified" : "Verification unsuccessful", html: kycStatus === "approved" ? "<p>Your identity is verified. You can now create listings.</p>" : "<p>Verification failed. Please try again with a valid ID.</p>" }).catch(()=>{});
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
