import connectDb from "@/config/db";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addCorsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request) {
    return handleOptions(request);
}

export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);
        const { productId } = params;
        
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

        // Remove product from wishlist
        if (user.wishlist) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
            await user.save();
        }

        const response = NextResponse.json({ 
            success: true, 
            wishlist: user.wishlist || [] 
        });
        return addCorsHeaders(response, request);

    } catch (error) {
        console.error("Error removing from wishlist:", error);
        const response = NextResponse.json({
            success: false, 
            message: "Failed to remove from wishlist",
            error: error.message
        }, { status: 500 });
        return addCorsHeaders(response, request);
    }
}
