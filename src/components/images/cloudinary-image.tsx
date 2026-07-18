"use client"

import { CldImage } from 'next-cloudinary'
import { useState } from 'react'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  crop?: 'fill' | 'fit' | 'crop' | 'scale' | 'thumb'
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
}

export function CloudinaryImage({
  src,
  alt,
  width = 600,
  height = 600,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  crop = 'fill',
  quality = 80,
  format = 'auto',
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-muted-foreground text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse rounded-lg"
          style={{ width, height }}
        />
      )}
      <CldImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        crop={{
          type: crop,
          source: true,
        }}
        quality={quality}
        format={format}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  )
}

// Product image component with specific optimizations
export function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={600}
      height={600}
      className={className}
      crop="fill"
      quality={85}
      format="auto"
    />
  )
}

// Thumbnail image component
export function ThumbnailImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      className={className}
      crop="thumb"
      quality={75}
      format="auto"
    />
  )
}

// Hero banner image component
export function HeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      className={className}
      crop="fill"
      quality={90}
      format="auto"
      priority
      sizes="100vw"
    />
  )
}
