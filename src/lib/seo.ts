// Structured Data (JSON-LD) generators

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Clove's",
    url: 'https://ai-shop.beratnev.com',
    logo: 'https://ai-shop.beratnev.com/logo.png',
    description: 'Premium fashion and clothing store with AI-powered styling assistance',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Fashion Avenue',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/cloves',
      'https://instagram.com/cloves',
      'https://twitter.com/cloves',
    ],
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  availability: string
  brand: string
  category: string
  sku: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability,
      url: `https://ai-shop.beratnev.com/products/${product.sku}`,
      seller: {
        '@type': 'Organization',
        name: "Clove's",
      },
    },
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    sku: product.sku,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Clove's",
    url: 'https://ai-shop.beratnev.com',
    description: 'Premium fashion and clothing store',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ai-shop.beratnev.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateFAQSchema(generalQuestions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: generalQuestions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

// Helper to generate structured data JSON string
export function generateStructuredDataJSON(schema: any): string {
  return JSON.stringify(schema)
}
