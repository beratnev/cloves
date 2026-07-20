const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const product = await prisma.product.create({
      data: {
        name: "AI Test Product",
        slug: `ai-test-${Date.now()}`,
        description: "Test description",
        price: 50,
        discountPrice: 70,
        stock: 10,
        department: "FRAGRANCE",
        category: "Perfume",
        tags: [],
        featured: true,
        status: "active",
        sku: "A8X9B2", // The example from prompt!
        barcode: null,
        attributes: { "fragranceFamily": "Floral" },
        aiAdvice: { keyBenefits: ["Test"], usageTips: ["Test"] },
      }
    });
    console.log("Product created:", product.id);

    // Try creating it again to trigger SKU collision
    const product2 = await prisma.product.create({
      data: {
        name: "AI Test Product 2",
        slug: `ai-test-2-${Date.now()}`,
        description: "Test description",
        price: 50,
        discountPrice: 70,
        stock: 10,
        department: "FRAGRANCE",
        category: "Perfume",
        tags: [],
        featured: true,
        status: "active",
        sku: "A8X9B2", // Same SKU!
        barcode: null,
        attributes: { "fragranceFamily": "Floral" },
        aiAdvice: { keyBenefits: ["Test"], usageTips: ["Test"] },
      }
    });
    console.log("Product 2 created:", product2.id);

  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
