import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting setup...')

  // 1. Create Admin User
  const adminEmail = 'cloves@admin.com'
  const adminPassword = 'Jh47x.!2ko9b'
  const hashedPassword = await hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created or updated:', admin.email)

  // Clear existing banners
  await prisma.banner.deleteMany({})

  // 2. Seed Banners
  const initialBanners = [
    {
      title: 'newSeasonCollection',
      subtitle: 'discoverLatestTrends',
      cta: 'shopNow',
      color: 'from-rose-500/20 to-purple-500/20',
      image: '/banners/1.png',
      link: '/products',
      order: 1,
    },
    {
      title: 'summerEssentials',
      subtitle: 'lightFabrics',
      cta: 'exploreCollection',
      color: 'from-amber-500/20 to-orange-500/20',
      image: '/banners/2.png',
      link: '/products?sale=true',
      order: 2,
    },
    {
      title: 'accessoriesRefresh',
      subtitle: 'completeYourLook',
      cta: 'viewAccessories',
      color: 'from-emerald-500/20 to-teal-500/20',
      image: '/banners/3.png',
      link: '/categories/fragrance',
      order: 3,
    },
  ]

  for (const banner of initialBanners) {
    await prisma.banner.create({
      data: banner,
    })
  }

  console.log('Banners seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
