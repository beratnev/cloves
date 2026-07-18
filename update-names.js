const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Fetching all products...')
  const products = await prisma.product.findMany()
  
  let updatedCount = 0

  for (const product of products) {
    if (product.name.startsWith("Clove's") || product.name.startsWith("clove's") || product.name.startsWith("CLOVE'S")) {
      // Remove "Clove's" and any leading space
      const newName = product.name.replace(/^Clove's\s*/i, '').trim()
      
      console.log(`Updating: "${product.name}" -> "${newName}"`)
      
      await prisma.product.update({
        where: { id: product.id },
        data: { name: newName }
      })
      
      updatedCount++
    }
  }

  console.log(`Successfully updated ${updatedCount} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
