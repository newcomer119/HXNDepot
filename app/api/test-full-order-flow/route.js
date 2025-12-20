/**
 * Test Full Order Flow
 * Creates order in database
 */

import { NextResponse } from "next/server";
import connectDb from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/Users";
import Address from "@/models/Address";
import Product from "@/models/Product";

export async function POST() {
    try {
        await connectDb();
        
        console.log('Testing full order flow...');
        
        // Find or create test user
        let testUser = await User.findOne({ email: 'test@example.com' });
        if (!testUser) {
            testUser = await User.create({
                _id: `test-user-${Date.now()}`,
                name: 'Test Customer',
                email: 'test@example.com',
                imageUrl: 'https://example.com/test-avatar.jpg',
                cartItems: {}
            });
        }
        
        // Find or create test address
        let testAddress = await Address.findOne({ userId: testUser._id.toString() });
        if (!testAddress) {
            testAddress = await Address.create({
                userId: testUser._id.toString(),
                fullName: 'Test Customer',
                phoneNumber: '9876543210',
                pincode: 248007,
                area: 'Test Area',
                city: 'Dehradun',
                state: 'Uttarakhand'
            });
        }
        
        // Find a test product
        const testProduct = await Product.findOne();
        if (!testProduct) {
            return NextResponse.json({
                success: false,
                message: 'No products found in database'
            }, { status: 400 });
        }
        
        // Create test order in database
        const testOrder = await Order.create({
            customOrderId: `TEST-DB-${Date.now()}`,
            userId: testUser._id.toString(),
            address: testAddress._id,
            items: [{
                product: testProduct._id,
                quantity: 1
            }],
            amount: 999,
            subtotal: 999,
            deliveryCharges: 50,
            discount: 0,
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            status: 'PENDING'
        });
        
        console.log('Test order created in database:', testOrder);
        
        return NextResponse.json({
            success: true,
            message: 'Test order created successfully',
            data: {
                orderId: testOrder._id,
                customOrderId: testOrder.customOrderId
            }
        });
        
    } catch (error) {
        console.error('Error in full order flow test:', error);
        return NextResponse.json({
            success: false,
            message: `Test failed: ${error.message}`,
            error: error.message
        }, { status: 500 });
    }
}
