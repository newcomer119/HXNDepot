import { NextResponse } from "next/server";

/**
 * Adds CORS headers to the response
 * @param {NextResponse} response - The Next.js response object
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} - Response with CORS headers
 */
export function addCorsHeaders(response, request) {
  const origin = request.headers.get("origin");
  
  // Allow requests from all origins (mobile apps, web, etc.)
  // Mobile apps typically don't send origin header, so we allow all
  if (origin) {
    // If origin is provided, use it (for web browsers)
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    // If no origin (mobile apps, Postman, etc.), allow all
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  // Allow all necessary HTTP methods
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  
  // Allow all necessary headers including Authorization for mobile apps
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  
  // Allow credentials (cookies, auth tokens)
  response.headers.set("Access-Control-Allow-Credentials", "true");
  
  // Cache preflight requests for 24 hours
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptions(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, request);
}
