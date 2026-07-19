import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rateSetting = await prisma.setting.findUnique({
      where: { key: 'TRY_EXCHANGE_RATE' }
    })
    
    if (rateSetting) {
      return NextResponse.json({ rate: parseFloat(rateSetting.value), updatedAt: rateSetting.updatedAt.toISOString() })
    }
    return NextResponse.json({ rate: 33.5, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Error reading exchange rate:', error)
    return NextResponse.json({ rate: 33.5, updatedAt: new Date().toISOString() })
  }
}
