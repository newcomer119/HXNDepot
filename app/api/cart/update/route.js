import connectDb from "@/config/db";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addCorsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request) {
    return handleOptions(request);
}

export async function POST(request) {
    try{
        const { userId} = getAuth(request);
        
        if (!userId) {
            const response = NextResponse.json({ 
                success: false, 
                message: "User not authenticated" 
            }, { status: 401 });
            return addCorsHeaders(response, request);
        }

        const { cartData } = await request.json()

        await connectDb()
        const user = await User.findById(userId)

        if (!user) {
            const response = NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
            return addCorsHeaders(response, request);
        }

        user.cartItems = cartData || {}
        await user.save()

        const response = NextResponse.json({ success : true})
        return addCorsHeaders(response, request)

    }catch(error){
        console.error("Error updating cart:", error);
        const response = NextResponse.json({ 
            success: false, 
            message: error.message || "Failed to update cart"
        }, { status: 500 });
        return addCorsHeaders(response, request)
    }
}