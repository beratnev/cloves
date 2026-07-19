const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (p.name.includes('Sunscreen')) {
      console.log('NAME:', p.name);
      console.log('DESCRIPTION:', p.description);
      console.log('AI ADVICE:', JSON.stringify(p.aiAdvice));
    }
  }
}
main().finally(() => prisma.$disconnect());
