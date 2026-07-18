const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const models = [
    'user', 'account', 'session', 'category', 'brand', 'color', 'size', 'material', 
    'product', 'productImage', 'order', 'orderItem', 'review', 'wishlist', 'recentlyViewed', 'aIConversation', 'outfit'
  ]
  
  console.log('Counting rows in all tables...')
  for (const model of models) {
    try {
      const count = await prisma[model].count()
      if (count > 0) {
        console.log(`${model}: ${count} rows`)
      }
    } catch (e) {
      console.log(`Failed to count ${model}:`, e.message)
    }
  }
}

main().finally(() => prisma.$disconnect())
