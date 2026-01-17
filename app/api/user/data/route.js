import connectDb from "@/config/db";
import User from "@/models/Users";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addCorsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request) {
    return handleOptions(request);
}

export async function GET(request){
    try{
        const{userId} = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "User not authenticated" 
            }, { status: 401 });
        }

        await connectDb()
        let user = await User.findById(userId)
        
        // If user doesn't exist in database, create them
        if(!user){
            // Get user data from Clerk
            const { clerkClient } = await import('@clerk/nextjs/server');
            const clerkUser = await clerkClient.users.getUser(userId);
            
            if (!clerkUser) {
                return NextResponse.json({ 
                    success: false, 
                    message: "User not found in Clerk" 
                }, { status: 404 });
            }

            // Create user in database
            const userData = {
                _id: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                imageUrl: clerkUser.imageUrl || '',
                cartItems: {}
            };

            user = await User.create(userData);
        }

        const response = NextResponse.json({success: true, user})
        return addCorsHeaders(response, request)

    }catch(error){
        console.error("Error in user data route:", error);
        const response = NextResponse.json({
            success: false, 
            message: "Failed to fetch user data",
            error: error.message
        }, { status: 500 });
        return addCorsHeaders(response, request)
    }
}