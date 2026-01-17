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
        const { cartData } = await request.json()

        await connectDb()
        const user = await User.findById(userId)

        user.cartItems = cartData
        await user.save()

        const response = NextResponse.json({ success : true})
        return addCorsHeaders(response, request)


    }catch(error){
        const response = NextResponse.json({ success: false, message : error.message})
        return addCorsHeaders(response, request)
    }
}