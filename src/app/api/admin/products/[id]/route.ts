export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        images: {
          orderBy: { position: 'asc' }
        }
      } as any
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: { ...product, comparePrice: product.discountPrice } })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

import { requireAdmin } from '@/lib/auth/admin-auth'

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const { id } = await params;
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

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
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

    // Handle image updates
    if (images) {
      // Delete existing images
      await (prisma as any).productImage.deleteMany({
        where: { productId: id }
      })

      if (images.length > 0) {
        // Create new images
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
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: 'asc' } } }
    })

    return NextResponse.json({ success: true, product: { ...updatedProduct, comparePrice: updatedProduct?.discountPrice } })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const { id } = await params;
    // Get product with images
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true
      } as any
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        const { deleteMultipleImages } = await import('@/lib/cloudinary')
        const publicIds = product.images.map((img: any) => img.publicId)
        await deleteMultipleImages(publicIds)
      } catch (e) {
        console.error('Error deleting from cloudinary', e)
      }
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
