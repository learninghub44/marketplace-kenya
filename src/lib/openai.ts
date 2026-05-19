import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ListingGenerationRequest {
  productName: string
  category: string
  features?: string[]
  targetAudience?: string
}

export interface ListingGenerationResponse {
  title: string
  description: string
  seoTags: string[]
  hashtags: string[]
}

export async function generateListing(
  request: ListingGenerationRequest
): Promise<ListingGenerationResponse> {
  try {
    const prompt = `Generate a compelling product listing for the Kenya marketplace.

Product: ${request.productName}
Category: ${request.category}
${request.features ? `Features: ${request.features.join(', ')}` : ''}
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}

Generate:
1. A catchy, SEO-optimized title (max 100 characters)
2. A detailed, persuasive description (200-300 words)
3. 5-10 SEO tags for search optimization
4. 5-10 relevant hashtags

Format the response as JSON with keys: title, description, seoTags (array), hashtags (array)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert e-commerce copywriter specializing in the Kenyan market. You create compelling, SEO-optimized product listings.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    return {
      title: response.title || request.productName,
      description: response.description || '',
      seoTags: response.seoTags || [],
      hashtags: response.hashtags || [],
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate listing')
  }
}

export async function moderateContent(content: string): Promise<{
  isAppropriate: boolean
  categories: string[]
  confidence: number
}> {
  try {
    const completion = await openai.moderations.create({
      input: content,
    })

    const result = completion.results[0]

    return {
      isAppropriate: !result.flagged,
      categories: Object.keys(result.categories).filter(
        (key) => result.categories[key as keyof typeof result.categories]
      ),
      confidence: result.category_scores ? Math.max(...Object.values(result.category_scores)) : 0,
    }
  } catch (error) {
    console.error('Moderation error:', error)
    return {
      isAppropriate: true,
      categories: [],
      confidence: 0,
    }
  }
}

export async function generateSmartSearchQuery(query: string): Promise<{
  refinedQuery: string
  filters: {
    category?: string
    priceRange?: { min: number; max: number }
    location?: string
  }
}> {
  try {
    const prompt = `Analyze this search query for a Kenyan marketplace: "${query}"

Extract:
1. A refined search query
2. Category (if mentioned)
3. Price range (if mentioned)
4. Location (if mentioned)

Return as JSON with keys: refinedQuery, filters (object with optional category, priceRange with min/max, location)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a search optimization expert for e-commerce platforms.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    return response
  } catch (error) {
    console.error('Smart search error:', error)
    return {
      refinedQuery: query,
      filters: {},
    }
  }
}

export async function detectFraud(listing: any): Promise<{
  isSuspicious: boolean
  reasons: string[]
  confidence: number
}> {
  try {
    const prompt = `Analyze this product listing for potential fraud or scam indicators:

Title: ${listing.title}
Description: ${listing.description}
Price: ${listing.price}
Category: ${listing.category}

Check for:
- Unusually low prices for the category
- Poor grammar or suspicious language
- Requests for off-platform payments
- Fake brand claims
- Duplicate content patterns

Return as JSON with keys: isSuspicious (boolean), reasons (array of strings), confidence (0-1)`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a fraud detection specialist for e-commerce platforms.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')

    return response
  } catch (error) {
    console.error('Fraud detection error:', error)
    return {
      isSuspicious: false,
      reasons: [],
      confidence: 0,
    }
  }
}
