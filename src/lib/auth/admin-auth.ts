import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"

export async function requireAdmin() {
  const session = await auth()
  
  if (!session || !session.user || session.user.email !== "beratnevcanoglu@outlook.com") {
    return NextResponse.json({ error: "Unauthorized access. Admin privileges required." }, { status: 403 })
  }
  
  return null
}
