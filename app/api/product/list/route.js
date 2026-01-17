import connectDb from "@/config/db"
import Product from "@/models/Product"
import { NextResponse } from "next/server"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

export async function OPTIONS(request) {
    return handleOptions(request);
}

export async function GET(request){
    try{
        await connectDb()
        
        // Get query parameters for pagination
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20"); // Default 20 products per page
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        
        // Build query
        const query = {};
        if (category && category !== "all") {
            // Support both exact match and main category match
            if (category.includes(" - ")) {
                query.category = category;
            } else {
                query.category = { $regex: `^${category} - `, $options: "i" };
            }
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Fetch products with pagination
        const [products, total] = await Promise.all([
            Product.find(query)
                .select("name price offerPrice image images category description averageRating totalReviews stock")
                .limit(limit)
                .skip(skip)
                .lean(),
            Product.countDocuments(query)
        ]);
        
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;
        
        const response = NextResponse.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasMore
            }
        });
        return addCorsHeaders(response, request);
    }catch(error){
        const response = NextResponse.json({success : false , message : error.message })
        return addCorsHeaders(response, request)
    }
}