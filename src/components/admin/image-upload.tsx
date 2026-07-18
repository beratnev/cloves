"use client"

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'

interface UploadedImage {
  publicId: string
  secureUrl: string
  width: number
  height: number
  format: string
  bytes: number
}

interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  folder?: string
  disabled?: boolean
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  folder = 'ai-shop/products',
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewImages, setPreviewImages] = useState<{ file: File; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await processFiles(files)
    }
  }, [disabled])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await processFiles(files)
    }
  }, [])

  const processFiles = async (files: File[]) => {
    // Check max images limit
    const remainingSlots = maxImages - images.length - previewImages.length
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToProcess = files.slice(0, remainingSlots)
    
    // Create previews
    const newPreviews = filesToProcess.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }))

    setPreviewImages(prev => [...prev, ...newPreviews])
    setError(null)
  }

  const uploadImages = async () => {
    if (previewImages.length === 0) return

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      previewImages.forEach(({ file }) => {
        formData.append('files', file)
      })
      formData.append('folder', folder)

      console.log('Sending upload request with', previewImages.length, 'files')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || `Upload failed with status ${response.status}`)
      }

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 30))
      }
      
      if (!responseData.images || !Array.isArray(responseData.images)) {
        throw new Error('Invalid response format from server')
      }

      onImagesChange([...images, ...responseData.images])
      setPreviewImages([])
      setUploadProgress(0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images'
      console.error('Upload error in component:', err)
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const removePreview = (index: number) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].url)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const removeImage = async (publicId: string) => {
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds: [publicId] }),
      })

      onImagesChange(images.filter(img => img.publicId !== publicId))
    } catch (err) {
      setError('Failed to delete image')
      console.error(err)
    }
  }

  const setPrimaryImage = (publicId: string) => {
    const primaryImage = images.find(img => img.publicId === publicId)
    if (primaryImage) {
      const otherImages = images.filter(img => img.publicId !== publicId)
      onImagesChange([primaryImage, ...otherImages])
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length + previewImages.length < maxImages && !disabled && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Drag and drop images here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse (max {maxImages} images)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                Select Images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Previews */}
      {previewImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Ready to upload ({previewImages.length})</p>
            <Button
              size="sm"
              onClick={uploadImages}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Images'
              )}
            </Button>
          </div>
          {uploading && (
            <Progress value={uploadProgress} className="h-2" />
          )}
          <div className="grid grid-cols-4 gap-3">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative aspect-square bg-transparent border rounded-lg">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-contain p-2 rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removePreview(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Uploaded Images ({images.length}/{maxImages})</p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={image.publicId} className="relative aspect-square group bg-transparent border rounded-lg">
                <img
                  src={image.secureUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-contain p-2 rounded-lg"
                />
                {index === 0 && (
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setPrimaryImage(image.publicId)}
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(image.publicId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && previewImages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}
