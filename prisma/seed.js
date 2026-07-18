const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'luxe-maison' },
      update: {},
      create: {
        name: 'Luxe Maison',
        slug: 'luxe-maison',
        description: 'French-inspired luxury fashion house known for timeless elegance and impeccable craftsmanship.',
        featured: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'urban-threads' },
      update: {},
      create: {
        name: 'Urban Threads',
        slug: 'urban-threads',
        description: 'Contemporary streetwear brand blending comfort with cutting-edge design.',
        featured: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'silk-road' },
      update: {},
      create: {
        name: 'Silk Road',
        slug: 'silk-road',
        description: 'Premium silk and cashmere pieces inspired by Eastern traditions and modern aesthetics.',
        featured: false,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'nordic-minimal' },
      update: {},
      create: {
        name: 'Nordic Minimal',
        slug: 'nordic-minimal',
        description: 'Scandinavian design philosophy meets functional elegance in every piece.',
        featured: true,
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'heritage-co' },
      update: {},
      create: {
        name: 'Heritage Co.',
        slug: 'heritage-co',
        description: 'Classic American heritage brand with a modern twist on timeless staples.',
        featured: false,
      },
    }),
  ])

  console.log('Created brands')

  // Create colors
  const colors = await Promise.all([
    prisma.color.upsert({ where: { name: 'Black' }, update: {}, create: { name: 'Black', hexCode: '#000000' } }),
    prisma.color.upsert({ where: { name: 'White' }, update: {}, create: { name: 'White', hexCode: '#FFFFFF' } }),
    prisma.color.upsert({ where: { name: 'Navy' }, update: {}, create: { name: 'Navy', hexCode: '#1E3A5F' } }),
    prisma.color.upsert({ where: { name: 'Beige' }, update: {}, create: { name: 'Beige', hexCode: '#F5F5DC' } }),
    prisma.color.upsert({ where: { name: 'Gray' }, update: {}, create: { name: 'Gray', hexCode: '#808080' } }),
    prisma.color.upsert({ where: { name: 'Burgundy' }, update: {}, create: { name: 'Burgundy', hexCode: '#800020' } }),
    prisma.color.upsert({ where: { name: 'Forest Green' }, update: {}, create: { name: 'Forest Green', hexCode: '#228B22' } }),
    prisma.color.upsert({ where: { name: 'Camel' }, update: {}, create: { name: 'Camel', hexCode: '#C19A6B' } }),
    prisma.color.upsert({ where: { name: 'Ivory' }, update: {}, create: { name: 'Ivory', hexCode: '#FFFFF0' } }),
    prisma.color.upsert({ where: { name: 'Charcoal' }, update: {}, create: { name: 'Charcoal', hexCode: '#36454F' } }),
  ])

  console.log('Created colors')

  // Create sizes
  const sizes = await Promise.all([
    prisma.size.upsert({ where: { name: 'XS' }, update: {}, create: { name: 'XS', category: 'tops', order: 0 } }),
    prisma.size.upsert({ where: { name: 'S' }, update: {}, create: { name: 'S', category: 'tops', order: 1 } }),
    prisma.size.upsert({ where: { name: 'M' }, update: {}, create: { name: 'M', category: 'tops', order: 2 } }),
    prisma.size.upsert({ where: { name: 'L' }, update: {}, create: { name: 'L', category: 'tops', order: 3 } }),
    prisma.size.upsert({ where: { name: 'XL' }, update: {}, create: { name: 'XL', category: 'tops', order: 4 } }),
    prisma.size.upsert({ where: { name: 'XXL' }, update: {}, create: { name: 'XXL', category: 'tops', order: 5 } }),
    prisma.size.upsert({ where: { name: '28' }, update: {}, create: { name: '28', category: 'bottoms', order: 0 } }),
    prisma.size.upsert({ where: { name: '30' }, update: {}, create: { name: '30', category: 'bottoms', order: 1 } }),
    prisma.size.upsert({ where: { name: '32' }, update: {}, create: { name: '32', category: 'bottoms', order: 2 } }),
    prisma.size.upsert({ where: { name: '34' }, update: {}, create: { name: '34', category: 'bottoms', order: 3 } }),
    prisma.size.upsert({ where: { name: '36' }, update: {}, create: { name: '36', category: 'bottoms', order: 4 } }),
    prisma.size.upsert({ where: { name: '38' }, update: {}, create: { name: '38', category: 'bottoms', order: 5 } }),
    prisma.size.upsert({ where: { name: '6' }, update: {}, create: { name: '6', category: 'shoes', order: 0 } }),
    prisma.size.upsert({ where: { name: '7' }, update: {}, create: { name: '7', category: 'shoes', order: 1 } }),
    prisma.size.upsert({ where: { name: '8' }, update: {}, create: { name: '8', category: 'shoes', order: 2 } }),
    prisma.size.upsert({ where: { name: '9' }, update: {}, create: { name: '9', category: 'shoes', order: 3 } }),
    prisma.size.upsert({ where: { name: '10' }, update: {}, create: { name: '10', category: 'shoes', order: 4 } }),
  ])

  console.log('Created sizes')

  // Create materials
  const materials = await Promise.all([
    prisma.material.upsert({ 
      where: { name: 'Cotton' }, 
      update: {}, 
      create: { name: 'Cotton', description: 'Breathable natural fiber, comfortable and easy to care for.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Silk' }, 
      update: {}, 
      create: { name: 'Silk', description: 'Luxurious natural protein fiber with a smooth, lustrous texture.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Cashmere' }, 
      update: {}, 
      create: { name: 'Cashmere', description: 'Ultra-soft premium wool from cashmere goats, incredibly warm and lightweight.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Leather' }, 
      update: {}, 
      create: { name: 'Leather', description: 'Durable and stylish material made from animal hides, develops character with age.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Denim' }, 
      update: {}, 
      create: { name: 'Denim', description: 'Sturdy cotton twill fabric, perfect for casual wear with timeless appeal.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Wool' }, 
      update: {}, 
      create: { name: 'Wool', description: 'Natural fiber with excellent insulation properties, ideal for cold weather.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Linen' }, 
      update: {}, 
      create: { name: 'Linen', description: 'Lightweight and breathable fabric perfect for warm weather.' } 
    }),
    prisma.material.upsert({ 
      where: { name: 'Polyester' }, 
      update: {}, 
      create: { name: 'Polyester', description: 'Synthetic fiber known for durability and wrinkle resistance.' } 
    }),
  ])

  console.log('Created materials')

  // Create categories with gender
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'dresses' },
      update: {},
      create: {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Elegant dresses for every occasion',
        gender: 'WOMEN',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tops' },
      update: {},
      create: {
        name: 'Tops',
        slug: 'tops',
        description: 'Stylish tops and blouses',
        gender: 'UNISEX',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bags' },
      update: {},
      create: {
        name: 'Bags',
        slug: 'bags',
        description: 'Premium handbags and totes',
        gender: 'UNISEX',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'shoes' },
      update: {},
      create: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Comfortable and stylish footwear',
        gender: 'UNISEX',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Fashion accessories to complete your look',
        gender: 'UNISEX',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'outerwear' },
      update: {},
      create: {
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Jackets, coats, and blazers',
        gender: 'UNISEX',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'bottoms' },
      update: {},
      create: {
        name: 'Bottoms',
        slug: 'bottoms',
        description: 'Pants, jeans, and skirts',
        gender: 'UNISEX',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sportswear' },
      update: {},
      create: {
        name: 'Sportswear',
        slug: 'sportswear',
        description: 'Athletic and activewear',
        gender: 'UNISEX',
      },
    }),
  ])

  console.log('Created categories')

  // Create products with fashion-specific fields
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'classic-leather-tote-bag' },
      update: {},
      create: {
        name: 'Classic Leather Tote Bag',
        slug: 'classic-leather-tote-bag',
        description: 'Premium genuine leather tote bag with spacious interior and elegant design. Perfect for work and everyday use. Features gold-tone hardware and a detachable shoulder strap.',
        price: 189,
        discountPrice: 149,
        stock: 45,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[2].id,
        brandId: brands[0].id,
        tags: ['leather', 'tote', 'bag', 'premium', 'work'],
        featured: true,
        status: 'active',
        seoTitle: 'Classic Leather Tote Bag - Clove\'s',
        seoDescription: 'Premium genuine leather tote bag with spacious interior and elegant design.',
        gender: 'UNISEX',
        fit: null,
        season: 'ALL_SEASON',
        occasion: 'WORK',
        style: 'CLASSIC',
        careInstructions: 'Wipe with damp cloth. Store in dust bag when not in use.',
        materialInfo: '100% genuine leather with cotton lining',
        sizeGuide: null,
        weight: 1.2,
        dimensions: '14" x 10" x 5"',
        sku: 'LMB-001',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'silk-blend-blouse' },
      update: {},
      create: {
        name: 'Silk Blend Blouse',
        slug: 'silk-blend-blouse',
        description: 'Luxurious silk blend blouse with elegant draping and comfortable fit. A wardrobe essential for any fashion-forward individual. Features a subtle sheen and delicate button details.',
        price: 89,
        discountPrice: 69,
        stock: 120,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[1].id,
        brandId: brands[2].id,
        tags: ['silk', 'blouse', 'top', 'elegant', 'versatile'],
        featured: true,
        status: 'active',
        seoTitle: 'Silk Blend Blouse - Clove\'s',
        seoDescription: 'Luxurious silk blend blouse with elegant draping and comfortable fit.',
        gender: 'WOMEN',
        fit: 'REGULAR',
        season: 'ALL_SEASON',
        occasion: 'BUSINESS',
        style: 'MINIMALIST',
        careInstructions: 'Dry clean only. Iron on low heat.',
        materialInfo: '70% silk, 30% cotton',
        sizeGuide: 'Measurements: XS (32"), S (34"), M (36"), L (38"), XL (40")',
        weight: 0.3,
        dimensions: null,
        sku: 'SRB-002',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'premium-leather-boots' },
      update: {},
      create: {
        name: 'Premium Leather Boots',
        slug: 'premium-leather-boots',
        description: 'Handcrafted leather boots with cushioned insole and durable outsole. Style meets comfort in this timeless design. Features a side zipper for easy wear.',
        price: 249,
        stock: 78,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[3].id,
        brandId: brands[4].id,
        tags: ['leather', 'boots', 'shoes', 'handcrafted', 'comfortable'],
        featured: true,
        status: 'active',
        seoTitle: 'Premium Leather Boots - Clove\'s',
        seoDescription: 'Handcrafted leather boots with cushioned insole and durable outsole.',
        gender: 'UNISEX',
        fit: null,
        season: 'FALL',
        occasion: 'CASUAL',
        style: 'CLASSIC',
        careInstructions: 'Clean with leather conditioner. Store with shoe trees.',
        materialInfo: 'Full-grain leather upper, rubber sole',
        sizeGuide: 'True to size. Half sizes available.',
        weight: 1.8,
        dimensions: null,
        sku: 'HCB-003',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'elegant-evening-dress' },
      update: {},
      create: {
        name: 'Elegant Evening Dress',
        slug: 'elegant-evening-dress',
        description: 'Stunning evening dress with flowing silhouette and intricate details. Perfect for special occasions and formal events. Features a flattering V-neckline and subtle beading.',
        price: 299,
        stock: 32,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[0].id,
        brandId: brands[0].id,
        tags: ['dress', 'overnight', 'formal', 'elegant', 'special-occasion'],
        featured: true,
        status: 'active',
        seoTitle: 'Elegant Evening Dress - Clove\'s',
        seoDescription: 'Stunning evening dress with flowing silhouette and intricate details.',
        gender: 'WOMEN',
        fit: 'SLIM',
        season: 'ALL_SEASON',
        occasion: 'FORMAL',
        style: 'MINIMALIST',
        careInstructions: 'Dry clean only. Hang to dry.',
        materialInfo: '100% silk with glass bead accents',
        sizeGuide: 'Measurements: XS (0-2), S (4-6), M (8-10), L (12-14), XL (16-18)',
        weight: 0.5,
        dimensions: null,
        sku: 'LM-004',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'cashmere-sweater' },
      update: {},
      create: {
        name: 'Cashmere Sweater',
        slug: 'cashmere-sweater',
        description: 'Ultra-soft cashmere sweater with classic fit. Luxuriously comfortable and effortlessly stylish. Features ribbed cuffs and hem for a polished look.',
        price: 159,
        stock: 200,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[1].id,
        brandId: brands[2].id,
        tags: ['cashmere', 'sweater', 'top', 'luxury', 'comfortable'],
        featured: false,
        status: 'active',
        seoTitle: 'Cashmere Sweater - Clove\'s',
        seoDescription: 'Ultra-soft cashmere sweater with classic fit and luxurious comfort.',
        gender: 'UNISEX',
        fit: 'REGULAR',
        season: 'FALL',
        occasion: 'CASUAL',
        style: 'MINIMALIST',
        careInstructions: 'Hand wash cold. Lay flat to dry.',
        materialInfo: '100% Grade A cashmere',
        sizeGuide: 'Oversized fit. Size down for a closer fit.',
        weight: 0.4,
        dimensions: null,
        sku: 'SR-005',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'designer-crossbody-bag' },
      update: {},
      create: {
        name: 'Designer Crossbody Bag',
        slug: 'designer-crossbody-bag',
        description: 'Chic crossbody bag with premium leather and gold-tone hardware. Perfect for everyday wear. Adjustable strap and multiple compartments.',
        price: 129,
        stock: 95,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[2].id,
        brandId: brands[0].id,
        tags: ['crossbody', 'bag', 'leather', 'designer', 'everyday'],
        featured: true,
        status: 'active',
        seoTitle: 'Designer Crossbody Bag - Clove\'s',
        seoDescription: 'Chic crossbody bag with premium leather and gold-tone hardware.',
        gender: 'UNISEX',
        fit: null,
        season: 'ALL_SEASON',
        occasion: 'CASUAL',
        style: 'MODERN',
        careInstructions: 'Wipe with damp cloth. Store in dust bag.',
        materialInfo: 'Vegetable-tanned leather',
        weight: 0.8,
        dimensions: '9" x 7" x 3"',
        sku: 'LM-006',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'classic-denim-jacket' },
      update: {},
      create: {
        name: 'Classic Denim Jacket',
        slug: 'classic-denim-jacket',
        description: 'Timeless denim jacket with modern fit. A versatile piece that never goes out of style. Features classic button closure and chest pockets.',
        price: 119,
        discountPrice: 99,
        stock: 25,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[5].id,
        brandId: brands[4].id,
        tags: ['denim', 'jacket', 'outerwear', 'classic', 'versatile'],
        featured: true,
        status: 'active',
        seoTitle: 'Classic Denim Jacket - Clove\'s',
        seoDescription: 'Timeless denim jacket with modern fit. A versatile classic.',
        gender: 'UNISEX',
        fit: 'REGULAR',
        season: 'ALL_SEASON',
        occasion: 'CASUAL',
        style: 'CLASSIC',
        careInstructions: 'Machine wash cold. Tumble dry low.',
        materialInfo: '100% cotton denim',
        sizeGuide: 'True to size. Relaxed fit through body.',
        weight: 1.0,
        dimensions: null,
        sku: 'HC-007',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'statement-earrings' },
      update: {},
      create: {
        name: 'Statement Earrings',
        slug: 'statement-earrings',
        description: 'Bold statement earrings with premium materials. Elevate any outfit with these eye-catching accessories. Hypoallergenic posts.',
        price: 79,
        stock: 60,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[4].id,
        brandId: brands[0].id,
        tags: ['earrings', 'accessories', 'statement', 'bold', 'elegant'],
        featured: false,
        status: 'active',
        seoTitle: 'Statement Earrings - Clove\'s',
        seoDescription: 'Bold statement earrings with premium materials for any outfit.',
        gender: 'UNISEX',
        fit: null,
        season: 'ALL_SEASON',
        occasion: 'PARTY',
        style: 'MODERN',
        careInstructions: 'Wipe with soft cloth. Avoid water and chemicals.',
        materialInfo: '18k gold-plated brass with cubic zirconia',
        weight: 0.1,
        dimensions: '3" drop',
        sku: 'LM-008',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'minimalist-wool-coat' },
      update: {},
      create: {
        name: 'Minimalist Wool Coat',
        slug: 'minimalist-wool-coat',
        description: 'Clean-lined wool coat with modern silhouette. Perfect for transitional weather. Features hidden buttons and side pockets.',
        price: 349,
        stock: 40,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[5].id,
        brandId: brands[3].id,
        tags: ['wool', 'coat', 'outerwear', 'minimalist', 'winter'],
        featured: true,
        status: 'active',
        seoTitle: 'Minimalist Wool Coat - Clove\'s',
        seoDescription: 'Clean-lined wool coat with modern silhouette for transitional weather.',
        gender: 'UNISEX',
        fit: 'OVERSIZED',
        season: 'WINTER',
        occasion: 'CASUAL',
        style: 'MINIMALIST',
        careInstructions: 'Dry clean only. Steam to remove wrinkles.',
        materialInfo: '100% virgin wool with polyester lining',
        sizeGuide: 'Oversized fit. Size down for a closer fit.',
        weight: 1.5,
        dimensions: null,
        sku: 'NM-009',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'slim-fit-chinos' },
      update: {},
      create: {
        name: 'Slim Fit Chinos',
        slug: 'slim-fit-chinos',
        description: 'Versatile slim-fit chinos that work from office to weekend. Stretch fabric for all-day comfort. Classic flat-front design.',
        price: 89,
        stock: 150,
        images: ['/placeholder-product.jpg'],
        categoryId: categories[6].id,
        brandId: brands[4].id,
        tags: ['chinos', 'pants', 'bottoms', 'versatile', 'office'],
        featured: false,
        status: 'active',
        seoTitle: 'Slim Fit Chinos - Clove\'s',
        seoDescription: 'Versatile slim-fit chinos that work from office to weekend.',
        gender: 'MEN',
        fit: 'SLIM',
        season: 'ALL_SEASON',
        occasion: 'BUSINESS',
        style: 'CLASSIC',
        careInstructions: 'Machine wash cold. Tumble dry low. Iron if needed.',
        materialInfo: '98% cotton, 2% elastane',
        sizeGuide: 'Waist measurements: 28 (28"), 30 (30"), 32 (32"), 34 (34"), 36 (36"), 38 (38")',
        weight: 0.6,
        dimensions: null,
        sku: 'HC-010',
      },
    }),
  ])

  console.log('Created products')

  // Link products with colors, sizes, and materials
  for (const product of products) {
    // Add colors
    await prisma.productColor.create({
      data: {
        productId: product.id,
        colorId: colors[Math.floor(Math.random() * colors.length)].id,
      },
    })
    
    // Add sizes
    const productSizes = sizes.filter(s => s.category === 'tops' || s.category === 'shoes' || s.category === 'bottoms')
    await prisma.productSize.create({
      data: {
        productId: product.id,
        sizeId: productSizes[Math.floor(Math.random() * productSizes.length)].id,
      },
    })
    
    // Add materials
    await prisma.productMaterial.create({
      data: {
        productId: product.id,
        materialId: materials[Math.floor(Math.random() * materials.length)].id,
      },
    })
  }

  console.log('Linked products with colors, sizes, and materials')

  // Create coupons
  await Promise.all([
    prisma.coupon.upsert({
      where: { code: 'WELCOME10' },
      update: {},
      create: {
        code: 'WELCOME10',
        discount: 10,
        type: 'percentage',
        minPurchase: 50,
        active: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'SAVE20' },
      update: {},
      create: {
        code: 'SAVE20',
        discount: 20,
        type: 'fixed',
        minPurchase: 100,
        active: true,
      },
    }),
    prisma.coupon.upsert({
      where: { code: 'LUXURY25' },
      update: {},
      create: {
        code: 'LUXURY25',
        discount: 25,
        type: 'percentage',
        minPurchase: 200,
        maxDiscount: 50,
        active: true,
      },
    }),
  ])

  console.log('Created coupons')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
