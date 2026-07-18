import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Create response that redirects to login
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  
  // Clear the admin session cookie
  response.cookies.set('admin-session', '', { 
    path: '/',
    expires: new Date(0),
    maxAge: 0
  })
  
  return response
}
