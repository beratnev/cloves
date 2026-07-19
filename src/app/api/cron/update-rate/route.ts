import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // Simple cron endpoint to fetch exchange rate
  // In production this should be protected by an authorization header (e.g. Vercel cron secret)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    
    if (data && data.rates && data.rates.TRY) {
      const tryRate = data.rates.TRY
      
      await prisma.setting.upsert({
        where: { key: 'TRY_EXCHANGE_RATE' },
        update: { value: String(tryRate) },
        create: { key: 'TRY_EXCHANGE_RATE', value: String(tryRate) }
      })
      
      return NextResponse.json({ success: true, rate: tryRate })
    }
    
    return NextResponse.json({ success: false, error: 'Failed to parse rate' }, { status: 500 })
  } catch (error) {
    console.error('Cron rate update failed:', error)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}
