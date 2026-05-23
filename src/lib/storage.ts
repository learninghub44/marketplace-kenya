import { supabase } from './supabase'

const BUCKET_NAME = 'marketplace-images'

export async function uploadImage(
  file: File,
  path: string
): Promise<{ url: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${path}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { url: '', error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return { url: publicUrl }
  } catch (error) {
    return { url: '', error: 'Failed to upload image' }
  }
}

export async function deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete image' }
  }
}

export async function validateImage(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit.' }
  }

  return { valid: true }
}

export async function compressImage(file: File): Promise<Blob> {
  // In a real implementation, you would use a library like sharp or browser-image-compression
  // For now, we'll return the original file
  return file
}
