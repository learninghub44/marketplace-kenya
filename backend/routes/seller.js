const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const express = require('express');
const router = express.Router();
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
router.post("/kyc-start", authenticate, authorize("seller","admin"), async (req, res) => {
  try {
    const CID = process.env.DIDIT_CLIENT_ID, CSEC = process.env.DIDIT_CLIENT_SECRET;
    if (!CID || !CSEC) {
      await supabaseAdmin.from("sellers").update({ kyc_status: "pending" }).eq("id", req.user.userId);
      return res.json({ success: true, verification_url: "https://verify.didit.me?demo=true" });
    }
    const tok = await fetch("https://apx.didit.me/auth/v2/token/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Basic " + Buffer.from(CID+":"+CSEC).toString("base64") }, body: new URLSearchParams({ grant_type: "client_credentials" }) }).then(r => r.json());
    const session = await fetch("https://apx.didit.me/v2/sessions/", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer "+tok.access_token }, body: JSON.stringify({ callback: process.env.DIDIT_CALLBACK_URL||"https://marketplace-kenya.pages.dev/seller/kyc", features: "OCR + FACE", vendor_data: req.user.userId }) }).then(r => r.json());
    if (!session.session_id) return res.status(500).json({ success: false, error: "Didit session failed" });
    await supabaseAdmin.from("sellers").update({ kyc_status: "pending", kyc_session_id: session.session_id }).eq("id", req.user.userId);
    res.json({ success: true, verification_url: session.url });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post("/kyc-webhook", async (req, res) => {
  try {
    const { vendor_data: userId, status } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing vendor_data" });
    const kycStatus = status === "approved" ? "approved" : status === "declined" ? "rejected" : "pending";
    await supabaseAdmin.from("sellers").update({ kyc_status: kycStatus, kyc_verified_at: kycStatus === "approved" ? new Date().toISOString() : null }).eq("id", userId);
    const { data: u } = await supabaseAdmin.from("users").select("email,name").eq("id", userId).maybeSingle();
    if (u?.email && kycStatus !== "pending") resend.emails.send({ from: "Sokoni Kenya <noreply@sokonikenya.co.ke>", to: u.email, subject: kycStatus === "approved" ? "Your seller account is verified" : "Verification unsuccessful", html: kycStatus === "approved" ? "<p>Your identity is verified. You can now create listings.</p>" : "<p>Verification failed. Please try again with a valid ID.</p>" }).catch(()=>{});
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
