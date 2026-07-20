const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log('Latest products:');
  for (const p of products) {
    console.log(`- ${p.id} | SKU: ${p.sku} | Name: ${p.name}`);
  }
}
main().finally(() => prisma.$disconnect());
