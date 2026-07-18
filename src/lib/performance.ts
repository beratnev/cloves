// Image optimization configuration
export const imageConfig = {
  formats: ['image/avif', 'image/webp'] as const,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const,
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384] as const,
}

// Cache configuration
export const cacheConfig = {
  // Static data cache duration (in seconds)
  staticData: 3600, // 1 hour
  
  // Product data cache duration
  products: 300, // 5 minutes
  
  // User session cache duration
  userSession: 86400, // 24 hours
  
  // Search results cache duration
  searchResults: 60, // 1 minute
}

// Cache key generators
export const cacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (params?: string) => `products${params ? `:${params}` : ''}`,
  category: (id: string) => `category:${id}`,
  user: (id: string) => `user:${id}`,
  search: (query: string) => `search:${query}`,
  trending: () => 'trending:products',
}

// Debounce utility for search and other input-heavy operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Intersection Observer for lazy loading elements
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    })
  }
  return null
}

// Prefetch strategy
export function prefetchLinks(urls: string[]) {
  if (typeof window === 'undefined') return
  
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}

// Critical CSS inline helper
export function getCriticalCSS() {
  // Return critical CSS for above-the-fold content
  // This would typically be extracted during build
  return ''
}

// Resource hints
export function addResourceHints() {
  if (typeof window === 'undefined') return
  
  const hints = [
    { rel: 'dns-prefetch', href: 'https://api.example.com' },
    { rel: 'preconnect', href: 'https://cdn.example.com' },
  ]
  
  hints.forEach(hint => {
    const link = document.createElement('link')
    Object.entries(hint).forEach(([key, value]) => {
      link.setAttribute(key, value)
    })
    document.head.appendChild(link)
  })
}
