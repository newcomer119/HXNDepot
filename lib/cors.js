import { NextResponse } from "next/server";

/**
 * Adds CORS headers to the response
 * @param {NextResponse} response - The Next.js response object
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} - Response with CORS headers
 */
export function addCorsHeaders(response, request) {
  const origin = request.headers.get("origin");
  
  // Allow requests from localhost (development) and your mobile app
  const allowedOrigins = [
    "http://localhost:8081",
    "http://localhost:19006",
    "http://localhost:3000",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:19006",
    "http://10.0.2.2:3000", // Android emulator
  ];

  // Check if origin is allowed or if it's a same-origin request
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Allow requests without origin (mobile apps, Postman, etc.)
    response.headers.set("Access-Control-Allow-Origin", "*");
  } else {
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  response.headers.set("Access-Control-Allow-Credentials", "true");
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
