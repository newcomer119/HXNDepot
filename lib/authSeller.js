import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authSeller = async (userId) => {
    try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const role = user.publicMetadata?.role;
        const position = user.publicMetadata?.position;

        // Check if user is a seller (role must be 'seller' for seller dashboard visibility)
        if (role === 'seller') {
            // Return object with role information for more granular control
            // isAdminSeller is true only if role is 'seller' AND position is 'seller-admin'
            return {
                isSeller: true,
                isAdminSeller: position === 'seller-admin'
            };
        } else {
            return {
                isSeller: false,
                isAdminSeller: false
            };
        }
    } catch (error) {
        return {
            isSeller: false,
            isAdminSeller: false
        };
    }
}

export default authSeller;