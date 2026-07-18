/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ai-shop.beratnev.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://ai-shop.beratnev.com',
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Compression
  compress: true,
  // Generate static pages where possible
  output: 'standalone',
}

export default nextConfig
