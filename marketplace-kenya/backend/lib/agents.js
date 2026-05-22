/**
 * Role-based AI Agents for Sokoni Kenya Marketplace
 * Primary: Google Gemini 1.5 Flash (free tier)
 * Fallback: OpenAI GPT-3.5-turbo
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGemini = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const safeGemini = async (prompt) => {
  const model = getGemini();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

const parseJSON = (text) => {
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return null;
  }
};

// ── 1. PRODUCT ASSISTANT AGENT (seller role) ──────────────────────────────────
const productAssistantAgent = async ({ productName, category, subcategory, condition, price, existingDescription }) => {
  const prompt = `You are a Product Listing Assistant for Sokoni Kenya, an African e-commerce marketplace.
Help this seller create an excellent product listing.

Product: ${productName}
Category: ${category}${subcategory ? ` > ${subcategory}` : ''}
Condition: ${condition || 'new'}
${price ? `Price: KES ${price}` : ''}
${existingDescription ? `Existing description: "${existingDescription}"` : ''}

Generate a complete listing in JSON format:
{
  "title": "compelling title under 80 chars",
  "description": "3-4 sentence professional description highlighting features, condition, and why it's a good deal for Kenyan buyers",
  "seo_tags": ["tag1","tag2","tag3","tag4","tag5"],
  "hashtags": ["#tag1","#tag2","#tag3"],
  "suggested_price_range": {"min": number, "max": number},
  "pricing_tip": "brief tip about pricing for this item in Kenya",
  "category_suggestion": "most appropriate category if different",
  "listing_tips": ["tip1","tip2","tip3"]
}

Return ONLY valid JSON.`;

  const text = await safeGemini(prompt);
  const data = parseJSON(text);
  if (!data) throw new Error('Failed to parse AI response');
  return data;
};

// ── 2. BUYER ASSISTANT AGENT (buyer role) ─────────────────────────────────────
const buyerAssistantAgent = async ({ query, budget, location, category, listings = [] }) => {
  const listingsSummary = listings.slice(0, 10).map((l, i) =>
    `${i + 1}. [${l.id}] ${l.title} - KES ${l.price} (${l.location || 'Kenya'}) - ${l.category}`
  ).join('\n');

  const prompt = `You are a Buyer Assistant for Sokoni Kenya marketplace.
Help this buyer find the best products.

Search query: "${query}"
${budget ? `Budget: KES ${budget}` : ''}
${location ? `Location: ${location}` : ''}
${category ? `Category preference: ${category}` : ''}

${listingsSummary ? `Available listings:\n${listingsSummary}` : ''}

Respond in JSON:
{
  "refined_query": "improved search query",
  "extracted_filters": {
    "category": "string or null",
    "price_min": number or null,
    "price_max": number or null,
    "location": "string or null",
    "condition": "new|used|refurbished or null",
    "keywords": ["keyword1","keyword2"]
  },
  "recommended_listing_ids": ["id1","id2"],
  "search_tips": ["tip to find better results"],
  "buyer_advice": "one sentence of buying advice for this product type in Kenya",
  "price_insight": "typical price range for this product in Kenya"
}

Return ONLY valid JSON.`;

  const text = await safeGemini(prompt);
  const data = parseJSON(text);
  if (!data) return { refined_query: query, extracted_filters: {}, recommended_listing_ids: [], search_tips: [], buyer_advice: '', price_insight: '' };
  return data;
};

// ── 3. ADMIN FRAUD DETECTION AGENT ───────────────────────────────────────────
const fraudDetectionAgent = async ({ listing, sellerHistory }) => {
  const prompt = `You are a Fraud Detection Agent for Sokoni Kenya marketplace.
Analyze this listing for fraud, scams, fake products, or policy violations.

Listing:
- Title: ${listing.title}
- Description: ${listing.description}
- Price: KES ${listing.price}
- Category: ${listing.category}
- Condition: ${listing.condition || 'not specified'}
- Location: ${listing.location}
- Images count: ${listing.images?.length || 0}

${sellerHistory ? `Seller history:
- Total listings: ${sellerHistory.listings_count || 0}
- Verified: ${sellerHistory.verified ? 'Yes' : 'No'}
- Joined: ${sellerHistory.created_at}` : ''}

Analyze for:
1. Unrealistic pricing (too cheap or too expensive)
2. Fake or misleading product claims
3. Scam patterns (advance fee, money laundering)
4. Duplicate or plagiarized descriptions
5. Illegal or prohibited items
6. Suspicious seller behavior

Respond in JSON:
{
  "is_suspicious": true/false,
  "risk_level": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "flags": ["flag1","flag2"],
  "reasons": ["detailed reason 1","detailed reason 2"],
  "recommended_action": "approve|review|reject|suspend",
  "moderation_notes": "brief note for admin reviewer"
}

Return ONLY valid JSON.`;

  const text = await safeGemini(prompt);
  const data = parseJSON(text);
  if (!data) return { is_suspicious: false, risk_level: 'low', confidence: 0.5, flags: [], reasons: [], recommended_action: 'approve', moderation_notes: '' };
  return data;
};

// ── 4. SUPPORT AGENT ──────────────────────────────────────────────────────────
const supportAgent = async ({ ticketSubject, ticketMessage, userRole, previousResponses = [] }) => {
  const history = previousResponses.slice(-3).map(r => `${r.is_admin ? 'Support' : 'User'}: ${r.message}`).join('\n');

  const prompt = `You are a Customer Support Agent for Sokoni Kenya marketplace.
Help resolve customer issues professionally.

Ticket Subject: ${ticketSubject}
User Role: ${userRole || 'buyer'}
User Message: "${ticketMessage}"
${history ? `\nConversation history:\n${history}` : ''}

Analyze and respond in JSON:
{
  "classification": "payment_issue|account_issue|listing_issue|order_issue|technical|fraud_report|general_inquiry",
  "priority": "low|medium|high|urgent",
  "sentiment": "positive|neutral|frustrated|angry",
  "suggested_response": "professional, empathetic response in 2-3 sentences addressing the user's concern",
  "resolution_steps": ["step1","step2","step3"],
  "escalate_to_human": true/false,
  "escalation_reason": "reason if escalation needed or null",
  "related_faqs": ["FAQ topic 1","FAQ topic 2"],
  "estimated_resolution_time": "e.g. 24 hours"
}

Return ONLY valid JSON.`;

  const text = await safeGemini(prompt);
  const data = parseJSON(text);
  if (!data) return {
    classification: 'general_inquiry',
    priority: 'medium',
    sentiment: 'neutral',
    suggested_response: 'Thank you for contacting Sokoni Kenya support. We will review your issue and get back to you within 24 hours.',
    resolution_steps: [],
    escalate_to_human: true,
    escalation_reason: 'AI parsing failed',
    related_faqs: [],
    estimated_resolution_time: '24 hours',
  };
  return data;
};

// ── 5. SMART SEARCH AGENT (enhanced) ─────────────────────────────────────────
const smartSearchAgent = async (query) => {
  const prompt = `You are a smart search engine for Sokoni Kenya marketplace.
Parse this search query and extract structured filters.

Query: "${query}"

Extract in JSON:
{
  "keywords": ["keyword1","keyword2"],
  "category": "detected category or null",
  "price_min": number or null,
  "price_max": number or null,
  "location": "Kenyan city/county or null",
  "condition": "new|used|refurbished or null",
  "brand": "brand name or null",
  "intent": "buy|browse|compare|research"
}

Return ONLY valid JSON.`;

  const text = await safeGemini(prompt);
  const data = parseJSON(text);
  return data || { keywords: [query], category: null, price_min: null, price_max: null, location: null, condition: null, brand: null, intent: 'browse' };
};

// ── 6. CONTENT MODERATION AGENT (enhanced) ───────────────────────────────────
const moderationAgent = async (content) => {
  const prompt = `Is this marketplace listing content appropriate for Sokoni Kenya?
Check for: scams, hate speech, illegal items, adult content, spam.

Content: "${content.substring(0, 1000)}"

Reply with JSON only:
{"flagged": true/false, "reason": "explanation or empty string", "severity": "low|medium|high"}`;

  const text = await safeGemini(prompt);
  const data = parseJSON(text);
  return data || { flagged: false, reason: '', severity: 'low' };
};

// ── Log agent call to DB ──────────────────────────────────────────────────────
const logAgentCall = async (supabaseAdmin, { userId, tenantId, agentType, userRole, input, output, durationMs, success, errorMessage }) => {
  try {
    await supabaseAdmin.from('ai_agent_logs').insert({
      user_id: userId || null,
      tenant_id: tenantId || '00000000-0000-0000-0000-000000000000',
      agent_type: agentType,
      user_role: userRole || null,
      input_data: input,
      output_data: output,
      model_used: 'gemini-1.5-flash',
      duration_ms: durationMs,
      success,
      error_message: errorMessage || null,
    });
  } catch { /* non-blocking */ }
};

module.exports = {
  productAssistantAgent,
  buyerAssistantAgent,
  fraudDetectionAgent,
  supportAgent,
  smartSearchAgent,
  moderationAgent,
  logAgentCall,
};
