import connectDb from "@/config/db";
import Seller from "@/models/Seller";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 });
        }

        // Check if user is already a seller
        await connectDb();
        const existingSeller = await Seller.findOne({ userId });

        if (existingSeller) {
            return NextResponse.json({
                success: false,
                message: "You have already submitted a seller application"
            }, { status: 400 });
        }

        const body = await request.json();
        const {
            businessName,
            businessType,
            contactPerson,
            email,
            phone,
            address,
            taxId,
            bankAccountDetails,
            productsCategory,
            yearsInBusiness,
            website,
            description
        } = body;

        // Validate required fields
        if (!businessName || !businessType || !contactPerson || !email || !phone ||
            !address?.street || !address?.city || !address?.state || !address?.zipCode || !address?.country ||
            !bankAccountDetails?.accountHolderName || !bankAccountDetails?.accountNumber ||
            !bankAccountDetails?.bankName || !bankAccountDetails?.routingNumber) {
            return NextResponse.json({
                success: false,
                message: "All required fields must be filled"
            }, { status: 400 });
        }

        if (!productsCategory || productsCategory.length === 0) {
            return NextResponse.json({
                success: false,
                message: "At least one product category must be selected"
            }, { status: 400 });
        }

        // Create seller record
        const newSeller = await Seller.create({
            userId,
            businessName,
            businessType,
            contactPerson,
            email,
            phone,
            address: {
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country
            },
            taxId: taxId || "",
            bankAccountDetails: {
                accountHolderName: bankAccountDetails.accountHolderName,
                accountNumber: bankAccountDetails.accountNumber,
                bankName: bankAccountDetails.bankName,
                routingNumber: bankAccountDetails.routingNumber
            },
            productsCategory,
            yearsInBusiness: yearsInBusiness ? Number(yearsInBusiness) : undefined,
            website: website || "",
            description: description || "",
            status: "pending"
        });

        // Optionally, you can update Clerk metadata to track seller status
        // Note: This doesn't grant seller access until approved
        try {
            const client = await clerkClient();
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    sellerApplicationStatus: "pending"
                }
            });
        } catch (clerkError) {
            console.error("Error updating Clerk metadata:", clerkError);
            // Don't fail the request if Clerk update fails
        }

        return NextResponse.json({
            success: true,
            message: "Seller registration submitted successfully. Your application is under review.",
            seller: newSeller
        });

    } catch (error) {
        console.error("Error in seller registration:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error submitting seller registration"
        }, { status: 500 });
    }
}

