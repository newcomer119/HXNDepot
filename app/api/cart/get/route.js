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
            const response = NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
            return addCorsHeaders(response, request);
        }

        const {cartItems} = user
        
        // Convert cartItems object to array and populate product details
        const cartItemsArray = [];
        if (cartItems && typeof cartItems === 'object' && Object.keys(cartItems).length > 0) {
            const Product = (await import("@/models/Product")).default;
            
            for (const [key, value] of Object.entries(cartItems)) {
                // Extract productId from key (format: "productId" or "productId_color")
                const productId = key.split('_')[0];
                
                try {
                    const product = await Product.findById(productId).lean();
                    if (product) {
                        cartItemsArray.push({
                            _id: key,
                            product: {
                                _id: product._id,
                                name: product.name,
                                price: product.offerPrice || product.price,
                                offerPrice: product.offerPrice,
                                images: product.images || product.image || [],
                                description: product.description,
                                stock: product.stock,
                            },
                            quantity: value?.quantity || 1,
                        });
                    }
                } catch (err) {
                    console.error(`Error fetching product ${productId}:`, err);
                }
            }
        }

        const response = NextResponse.json({ success: true, cartItems: cartItemsArray })
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