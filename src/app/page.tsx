import { prisma } from "@/lib/prisma"
import HomePage from "./HomePage"

// This is a Server Component, meaning it fetches data directly from the DB
// before sending any HTML to the browser. This eliminates loading spinners
// on the first load and dramatically improves SEO and performance.

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export default async function Page() {
  // Fetch initial data concurrently
  const [products, banners] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'active' },
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { position: 'asc' } },
        brand: true,
      }
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
  ]);

  return <HomePage initialProducts={products as any} initialBanners={banners} />
}
