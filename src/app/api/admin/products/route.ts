export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } },
      ]
    }
    
    if (category) {
      where.category = category
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: { position: 'asc' }
          }
        } as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    // Map Prisma products to match Frontend Product interface
    const mappedProducts = products.map(p => ({
      ...p,
      comparePrice: p.discountPrice, // Map discountPrice to comparePrice for frontend
    }))

    return NextResponse.json({
      products: mappedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

import { requireAdmin } from '@/lib/auth/admin-auth'

// POST create product
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const body = await request.json()
    
    const {
      name,
      description,
      price,
      comparePrice,
      stock,
      department,
      category,
      tags,
      featured,
      status,
      sku,
      barcode,
      attributes,
      aiAdvice,
      images
    } = body

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`, // Ensure unique slug
        description: description || '',
        price: parseFloat(price) || 0,
        discountPrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock) || 0,
        department: department || 'NEW',
        category: category || 'Uncategorized',
        tags: tags || [],
        featured: featured || false,
        status: status || 'active',
        sku,
        barcode,
        attributes: attributes ? JSON.parse(JSON.stringify(attributes)) : null,
        aiAdvice: aiAdvice ? JSON.parse(JSON.stringify(aiAdvice)) : null,
      } as any
    })

    // Create product images
    if (images && images.length > 0) {
      await (prisma as any).productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: product.id,
          publicId: img.publicId,
          secureUrl: img.secureUrl,
          width: img.width,
          height: img.height,
          format: img.format,
          bytes: img.bytes,
          isPrimary: index === 0,
          position: index
        }))
      })
    }
    
    // Fetch newly created product with images
    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: { orderBy: { position: 'asc' } } }
    })

    return NextResponse.json({ success: true, product: { ...createdProduct, comparePrice: createdProduct?.discountPrice } })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
