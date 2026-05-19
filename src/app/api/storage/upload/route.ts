import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, validateImage } from '@/lib/storage'
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const path = formData.get('path') as string

    if (!file || !path) {
      return NextResponse.json(
        { success: false, error: 'File and path are required' },
        { status: 400 }
      )
    }

    // Validate image
    const validation = await validateImage(file)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Upload image
    const result = await uploadImage(file, path)

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, url: result.url })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
