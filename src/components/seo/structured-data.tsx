export function StructuredData({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Shop',
    url: 'https://ai-shop.beratnev.com',
    description: 'AI-powered e-commerce platform with intelligent product recommendations and natural language search',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ai-shop.beratnev.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return <StructuredData data={data} />
}

export function ProductStructuredData(product: {
  name: string
  description: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  brand?: string
  sku?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    brand: product.brand || 'AI Shop',
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.discountPrice || product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://ai-shop.beratnev.com/products/${product.sku}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }

  return <StructuredData data={data} />
}

export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Shop',
    url: 'https://ai-shop.beratnev.com',
    logo: 'https://ai-shop.beratnev.com/logo.png',
    description: 'AI-powered e-commerce platform with intelligent product recommendations and natural language search',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://twitter.com/aishop',
      'https://facebook.com/aishop',
      'https://instagram.com/aishop',
    ],
  }

  return <StructuredData data={data} />
}
