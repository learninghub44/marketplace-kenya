import { NextRequest, NextResponse } from 'next/server'
import { generateListing } from '@/lib/openai'
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
    const { productName, category, features, targetAudience } = body

    if (!productName || !category) {
      return NextResponse.json(
        { success: false, error: 'Product name and category are required' },
        { status: 400 }
      )
    }

    const result = await generateListing({
      productName,
      category,
      features,
      targetAudience,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate listing' },
      { status: 500 }
    )
  }
}
