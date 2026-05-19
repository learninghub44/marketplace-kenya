const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate listing using OpenAI
const generateListingOpenAI = async (productName, category) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates product listings for a marketplace. Generate a detailed, SEO-optimized product description.',
        },
        {
          role: 'user',
          content: `Generate a product listing for: ${productName} in category: ${category}. Include title, description, and key features.`,
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    return { description: content };
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to generate listing with OpenAI');
  }
};

// Generate listing using Gemini
const generateListingGemini = async (productName, category) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a product listing for: ${productName} in category: ${category}. Include title, description, and key features.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return { description: content };
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Failed to generate listing with Gemini');
  }
};

// Moderate content using OpenAI
const moderateContentOpenAI = async (content) => {
  try {
    const response = await openai.moderations.create({
      input: content,
    });

    const results = response.results[0];
    return {
      flagged: results.flagged,
      categories: results.categories,
      scores: results.category_scores,
    };
  } catch (error) {
    console.error('OpenAI moderation error:', error);
    throw new Error('Failed to moderate content with OpenAI');
  }
};

// Moderate content using Gemini
const moderateContentGemini = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this content for inappropriate language, scams, or policy violations: ${content}. Return a JSON response with "flagged" (boolean) and "reason" (string).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response (simplified)
    const flagged = text.toLowerCase().includes('flagged') && text.toLowerCase().includes('true');

    return { flagged, reason: text };
  } catch (error) {
    console.error('Gemini moderation error:', error);
    throw new Error('Failed to moderate content with Gemini');
  }
};

// Generate smart search query using OpenAI
const generateSmartSearchOpenAI = async (query) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a search assistant. Convert natural language queries into structured search parameters.',
        },
        {
          role: 'user',
          content: `Convert this search query into search parameters: ${query}. Return JSON with keywords, category, price_range, location.`,
        },
      ],
      max_tokens: 200,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI smart search error:', error);
    throw new Error('Failed to generate smart search with OpenAI');
  }
};

// Generate smart search query using Gemini
const generateSmartSearchGemini = async (query) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Convert this search query into search parameters: ${query}. Return JSON with keywords, category, price_range, location.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini smart search error:', error);
    throw new Error('Failed to generate smart search with Gemini');
  }
};

// Detect fraud using OpenAI
const detectFraudOpenAI = async (listingData) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a fraud detection assistant. Analyze listings for potential scams.',
        },
        {
          role: 'user',
          content: `Analyze this listing for fraud: ${JSON.stringify(listingData)}. Return JSON with "is_suspicious" (boolean) and "reasons" (array).`,
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI fraud detection error:', error);
    throw new Error('Failed to detect fraud with OpenAI');
  }
};

// Detect fraud using Gemini
const detectFraudGemini = async (listingData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this listing for fraud: ${JSON.stringify(listingData)}. Return JSON with "is_suspicious" (boolean) and "reasons" (array).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini fraud detection error:', error);
    throw new Error('Failed to detect fraud with Gemini');
  }
};

module.exports = {
  generateListingOpenAI,
  generateListingGemini,
  moderateContentOpenAI,
  moderateContentGemini,
  generateSmartSearchOpenAI,
  generateSmartSearchGemini,
  detectFraudOpenAI,
  detectFraudGemini,
};
