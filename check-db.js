const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log(`Total products in DB: ${count}`)
  
  if (count > 0) {
    const sample = await prisma.product.findMany({ take: 5 })
    console.log('Sample products:', JSON.stringify(sample.map(p => p.name), null, 2))
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
