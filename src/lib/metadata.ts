import { Metadata } from 'next'

export function getSiteMetadata(): Metadata {
  return {
    title: {
      default: "Clove's - Premium Fashion & Clothing",
      template: "%s | Clove's",
    },
    description: 'Premium fashion destination for clothing, bags, accessories, shoes, and more. Discover your style with our AI-powered fashion assistant.',
    keywords: ['fashion', 'clothing', 'bags', 'accessories', 'shoes', 'dresses', 'premium fashion', 'style'],
    authors: [{ name: "Clove's" }],
    creator: "Clove's",
    publisher: "Clove's",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://cloves.beratnev.com'),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://cloves.beratnev.com',
      siteName: "Clove's",
      title: "Clove's - Premium Fashion & Clothing",
      description: 'Premium fashion destination for clothing, bags, accessories, shoes, and more.',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: "Clove's",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Clove's - Premium Fashion & Clothing",
      description: 'Premium fashion destination for clothing, bags, accessories, shoes, and more.',
      images: ['/og-image.png'],
      creator: '@cloves',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
}
}

export function getProductMetadata(product: {
  name: string
  description: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
}): Metadata {
  const price = product.discountPrice || product.price
  return {
    title: product.name,
    description: product.description,
    keywords: [product.name, product.category, 'fashion', 'clothing', 'style'],
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  }
}
