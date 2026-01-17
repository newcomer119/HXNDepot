import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware((auth, request) => {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');

    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      // Allow requests from all origins (mobile apps, web, etc.)
      if (origin) {
        // If origin is provided, use it (for web browsers)
        response.headers.set('Access-Control-Allow-Origin', origin);
      } else {
        // If no origin (mobile apps), allow all
        response.headers.set('Access-Control-Allow-Origin', '*');
      }
      
      // Allow all necessary HTTP methods
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      
      // Allow all necessary headers including Authorization for mobile apps
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      
      // Allow credentials (cookies, auth tokens)
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      // Cache preflight requests for 24 hours
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