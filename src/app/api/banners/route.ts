import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
    
    return NextResponse.json(banners)
  } catch (error) {
    console.error("[BANNERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
