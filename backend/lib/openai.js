const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini is the primary AI provider (free tier available)
const getGemini = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('AI service not configured. Please add GEMINI_API_KEY to Render environment variables.');
  return new GoogleGenerativeAI(key);
};

const generateListingGemini = async (productName, category) => {
  const model = getGemini().getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `You are a marketplace listing assistant for Sokoni Kenya.
Write a compelling product listing description for:
Product: ${productName}
Category: ${category}

Write 3-4 sentences that:
- Highlight key features and benefits
- Mention condition if relevant (new/used)
- Appeal to Kenyan buyers
- Are honest and professional

Return ONLY the description text, no headings or extra formatting.`;

  const result = await model.generateContent(prompt);
  return { description: result.response.text().trim() };
};

// OpenAI fallback (if key provided)
const generateListingOpenAI = async (productName, category) => {
  if (!process.env.OPENAI_API_KEY) return generateListingGemini(productName, category);
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a marketplace assistant for Sokoni Kenya. Write compelling, honest product descriptions.' },
        { role: 'user', content: `Write a 3-4 sentence product description for: ${productName} in category: ${category}. Keep it professional and appeal to Kenyan buyers.` },
      ],
      max_tokens: 200,
    });
    return { description: response.choices[0].message.content.trim() };
  } catch (e) {
    return generateListingGemini(productName, category);
  }
};

const moderateContentGemini = async (content) => {
  try {
    const model = getGemini().getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Is this marketplace listing content appropriate? Check for scams, fake products, hate speech, or illegal items.
Content: "${content}"
Reply with JSON only: {"flagged": true/false, "reason": "explanation or empty string"}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    return { flagged: false, reason: '' };
  }
};

const moderateContentOpenAI = moderateContentGemini;
const generateSmartSearchOpenAI = async (q) => ({ keywords: q });
const generateSmartSearchGemini = async (q) => ({ keywords: q });
const detectFraudOpenAI = async () => ({ is_suspicious: false, reasons: [] });
const detectFraudGemini = async () => ({ is_suspicious: false, reasons: [] });

module.exports = {
  generateListingOpenAI, generateListingGemini,
  moderateContentOpenAI, moderateContentGemini,
  generateSmartSearchOpenAI, generateSmartSearchGemini,
  detectFraudOpenAI, detectFraudGemini,
};
