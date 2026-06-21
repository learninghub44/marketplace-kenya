const Groq = require('groq-sdk');

// Groq is the primary AI provider — fast inference, generous free tier
const getGroq = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('AI service not configured. Please add GROQ_API_KEY to Render environment variables.');
  return new Groq({ apiKey: key });
};

const MODEL = 'llama-3.3-70b-versatile';
const VALID_CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Vehicles', 'Agriculture', 'Sports', 'Baby & Kids', 'Property', 'Services', 'Health & Beauty'];

const safeJson = (text, fallback) => {
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    return fallback;
  }
};

const generateListingGroq = async (productName, category) => {
  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a marketplace listing assistant for Sokoni Kenya. Write compelling, honest product descriptions.' },
      { role: 'user', content: `Write a 3-4 sentence product description for: ${productName} in category: ${category}.\nHighlight likely features/benefits, mention condition if relevant (new/used), and appeal to Kenyan buyers. Be honest and professional. Return ONLY the description text, no headings or extra formatting.` },
    ],
    max_tokens: 250,
    temperature: 0.7,
  });
  return { description: completion.choices[0].message.content.trim() };
};

const moderateContentGroq = async (content) => {
  try {
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a content moderation system for a Kenyan marketplace. You only ever respond with raw JSON, no commentary.' },
        { role: 'user', content: `Is this marketplace listing content appropriate? Check for scams, fake/counterfeit products, hate speech, weapons, drugs, or other illegal items.\n\nContent: "${content}"\n\nReply with JSON only: {"flagged": true/false, "reason": "short explanation or empty string"}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });
    return safeJson(completion.choices[0].message.content, { flagged: false, reason: '' });
  } catch (e) {
    return { flagged: false, reason: '' };
  }
};

const smartSearchGroq = async (query) => {
  try {
    const groq = getGroq();
    const prompt = `Analyze this search query typed by a buyer on a Kenyan marketplace: "${query}"

Extract:
1. A refined search query — just the core product keywords, with filler words (e.g. "I want", "near", "under", "cheap") removed.
2. Category — ONLY if clearly implied, must be exactly one of: ${VALID_CATEGORIES.join(', ')}. Otherwise null.
3. Price range in KES if a budget is mentioned (e.g. "under 20k" -> max 20000). Otherwise null.
4. Location — a Kenyan town/city/county if mentioned. Otherwise null.

Reply with JSON only in this exact shape:
{"refinedQuery": "...", "filters": {"category": "..." or null, "priceRange": {"min": number, "max": number} or null, "location": "..." or null}}`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a search query parser for an e-commerce platform. You only ever respond with raw JSON, no commentary.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });
    const parsed = safeJson(completion.choices[0].message.content, { refinedQuery: query, filters: {} });
    if (parsed.filters?.category && !VALID_CATEGORIES.includes(parsed.filters.category)) {
      parsed.filters.category = null;
    }
    return parsed;
  } catch (e) {
    return { refinedQuery: query, filters: {} };
  }
};

const detectFraudGroq = async (listing) => {
  try {
    const groq = getGroq();
    const prompt = `Analyze this product listing on a Kenyan marketplace for potential fraud or scam indicators:

Title: ${listing.title}
Description: ${listing.description}
Price: KES ${listing.price}
Category: ${listing.category}

Check for:
- Unusually low price for the category (classic bait pricing)
- Poor grammar, excessive urgency, or pressure language
- Requests to pay a deposit or move off-platform before viewing
- Fake or unverifiable brand/authenticity claims
- Vague, generic, or copy-pasted-sounding descriptions

Reply with JSON only: {"isSuspicious": true/false, "reasons": ["short reason", ...], "confidence": 0.0-1.0}`;

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a fraud detection specialist for a Kenyan e-commerce marketplace. You only ever respond with raw JSON, no commentary.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });
    return safeJson(completion.choices[0].message.content, { isSuspicious: false, reasons: [], confidence: 0 });
  } catch (e) {
    return { isSuspicious: false, reasons: [], confidence: 0 };
  }
};

module.exports = {
  generateListingGroq,
  moderateContentGroq,
  smartSearchGroq,
  detectFraudGroq,
};
