const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.productColor.deleteMany()
  await prisma.productSize.deleteMany()
  await prisma.productMaterial.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.color.deleteMany()
  await prisma.size.deleteMany()
  await prisma.material.deleteMany()
  await prisma.coupon.deleteMany()
  console.log("All pseudo-data deleted successfully from the database!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
