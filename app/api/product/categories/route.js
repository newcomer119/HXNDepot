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
        
        // Get all unique categories from all products
        const categories = await Product.distinct("category");
        
        // Filter out null/undefined/empty categories
        const validCategories = categories.filter(cat => cat && cat.trim().length > 0);
        
        const response = NextResponse.json({
            success: true,
            categories: validCategories
        });
        return addCorsHeaders(response, request);
    }catch(error){
        const response = NextResponse.json({success : false , message : error.message })
        return addCorsHeaders(response, request)
    }
}
