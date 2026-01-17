import connectDb from "@/config/db";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addCorsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request) {
    return handleOptions(request);
}

export async function GET(request) {
    try{
        const {userId} = getAuth(request)

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "User not authenticated" 
            }, { status: 401 });
        }

        await connectDb()
        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
        }

        const {cartItems} = user

        const response = NextResponse.json({ success: true, cartItems})
        return addCorsHeaders(response, request)

    }catch(error){
        console.error("Error in cart get route:", error);
        const response = NextResponse.json({
            success: false, 
            message: "Failed to fetch cart items",
            error: error.message
        }, { status: 500 });
        return addCorsHeaders(response, request)
    }
}