import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware((auth, request) => {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    
    // Allow requests from localhost (development) and mobile app
    const allowedOrigins = [
      'http://localhost:8081',
      'http://localhost:19006',
      'http://localhost:3000',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:19006',
      'http://10.0.2.2:3000', // Android emulator
    ];

    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      } else {
        response.headers.set('Access-Control-Allow-Origin', '*');
      }
      
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
      
      return response;
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}