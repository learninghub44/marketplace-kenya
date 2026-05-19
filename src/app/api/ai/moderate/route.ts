import { NextRequest, NextResponse } from 'next/server'
import { moderateContent } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    const result = await moderateContent(content)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to moderate content' },
      { status: 500 }
    )
  }
}
