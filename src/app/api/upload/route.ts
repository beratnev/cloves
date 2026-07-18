import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadMultipleImages, deleteImage, deleteMultipleImages } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary configuration (support both formats)
    const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
    const hasIndividualVars = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    
    if (!hasCloudinaryUrl && !hasIndividualVars) {
      return NextResponse.json({ error: 'Cloudinary not configured. Set CLOUDINARY_URL or individual env vars.' }, { status: 500 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    console.log('Received files:', files.length)
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Validate files
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      const maxSize = 10 * 1024 * 1024 // 10MB
      const isValid = validTypes.includes(file.type) && file.size <= maxSize
      console.log(`File ${file.name}: type=${file.type}, size=${file.size}, valid=${isValid}`)
      return isValid
    })

    if (validFiles.length === 0) {
      return NextResponse.json({ error: 'No valid files provided' }, { status: 400 })
    }

    const folder = formData.get('folder') as string || 'ai-shop/products'
    console.log('Uploading to folder:', folder)
    
    // Upload images
    console.log('Starting upload of', validFiles.length, 'files')
    const results = await uploadMultipleImages(validFiles, folder)
    console.log('Upload results:', results)
    
    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'Upload returned no results' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      images: results.map((result: any) => ({
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      }))
    })
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload images'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { publicIds } = body

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json({ error: 'No public IDs provided' }, { status: 400 })
    }

    const results = await deleteMultipleImages(publicIds)
    
    return NextResponse.json({ 
      success: true, 
      deleted: results 
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete images' }, { status: 500 })
  }
}
