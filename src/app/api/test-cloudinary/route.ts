import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables only (no Cloudinary config)
    const envCheck = {
      CLOUDINARY_URL: process.env.CLOUDINARY_URL ? 'set' : 'not set',
      CLOUDINARY_URL_VALUE: process.env.CLOUDINARY_URL ? process.env.CLOUDINARY_URL.substring(0, 30) + '...' : 'not set',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'not set',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'set' : 'not set',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'set' : 'not set',
    };

    console.log('Environment check:', envCheck);

    return NextResponse.json({ 
      success: true,
      envCheck
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
