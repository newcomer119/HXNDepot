import connectDb from "@/config/db";
import User from "@/models/Users";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addCorsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request) {
    return handleOptions(request);
}

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            const response = NextResponse.json({ 
                success: false, 
                message: "User not authenticated" 
            }, { status: 401 });
            return addCorsHeaders(response, request);
        }

        await connectDb();
        const user = await User.findById(userId);
        
        if (!user) {
            const response = NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
            return addCorsHeaders(response, request);
        }

        // Get wishlist product IDs and fetch full product details
        const wishlistIds = user.wishlist || [];
        const products = await Product.find({ _id: { $in: wishlistIds } });

        const response = NextResponse.json({ 
            success: true, 
            wishlist: products 
        });
        return addCorsHeaders(response, request);

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        const response = NextResponse.json({
            success: false, 
            message: "Failed to fetch wishlist",
            error: error.message
        }, { status: 500 });
        return addCorsHeaders(response, request);
    }
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            const response = NextResponse.json({ 
                success: false, 
                message: "User not authenticated" 
            }, { status: 401 });
            return addCorsHeaders(response, request);
        }

        const { productId } = await request.json();
        
        if (!productId) {
            const response = NextResponse.json({ 
                success: false, 
                message: "Product ID is required" 
            }, { status: 400 });
            return addCorsHeaders(response, request);
        }

        await connectDb();
        const user = await User.findById(userId);
        
        if (!user) {
            const response = NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
            return addCorsHeaders(response, request);
        }

        // Add product to wishlist if not already present
        if (!user.wishlist) {
            user.wishlist = [];
        }
        
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        const response = NextResponse.json({ 
            success: true, 
            wishlist: user.wishlist 
        });
        return addCorsHeaders(response, request);

    } catch (error) {
        console.error("Error adding to wishlist:", error);
        const response = NextResponse.json({
            success: false, 
            message: "Failed to add to wishlist",
            error: error.message
        }, { status: 500 });
        return addCorsHeaders(response, request);
    }
}
