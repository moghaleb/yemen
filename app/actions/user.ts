'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateUserSubscription(formData: FormData) {
    const userId = formData.get("userId") as string;
    const tier = formData.get("tier") as string;
    const expiryDate = formData.get("expiryDate") as string;

    if (!userId || !tier) {
        throw new Error("Missing required fields");
    }

    // Determine expiry: if date provided use it, otherwise if BASIC/VIP enable for 30 days default if no date?
    // Actually, let's just use the date provided. If empty and tier is not FREE, maybe default to 30 days from now?
    // For now, strict: if date provided, use it. If cleared, set null.

    console.log("Updating user subscription:", { userId, tier, expiryDate });

    let expiry: Date | null = null;
    if (expiryDate && expiryDate !== "") {
        expiry = new Date(expiryDate);
        // Validate date
        if (isNaN(expiry.getTime())) {
            expiry = null;
        }
    }

    // If switching to FREE, expiry should be null effectively, but let's allow admin to set it if they really want.
    // However, if tier is FREE, it usually implies no expiry. 
    if (tier === 'FREE') {
        expiry = null;
    }

    try {
        console.log(`Updating user ${userId} to tier ${tier} with expiry ${expiry}`);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: tier,
                subscriptionExpiry: expiry,
            }
        });

        console.log("User updated successfully:", updatedUser.id);
        revalidatePath("/admin/users");
    } catch (error) {
        console.error("Failed to update user subscription:", error);
        throw error;
    }
}

export async function deleteUser(formData: FormData) {
    const userId = formData.get("userId") as string;

    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }

        // Prevent admin from deleting themselves
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (currentUser?.id === userId) {
            throw new Error("لا يمكنك حذف حسابك الشخصي");
        }

        console.log(`Starting deletion for user ${userId}`);

        // Handle related records to avoid foreign key constraints
        // We delete them in a transaction for safety
        await prisma.$transaction([
            prisma.subscriptionRequest.deleteMany({ where: { userId } }),
            prisma.consultationRequest.deleteMany({ where: { userId } }),
            prisma.pushSubscription.deleteMany({ where: { userId } }),
            prisma.user.delete({ where: { id: userId } })
        ]);

        console.log("User and related records deleted successfully");
        revalidatePath("/admin/users");
        revalidatePath("/admin/consultations");
        revalidatePath("/admin/requests");

        // Removed return for TypeScript compatibility with form actions
    } catch (error: any) {
        console.error("Failed to delete user:", error);
        throw new Error(error.message || "فشل حذف المستخدم");
    }
}

export async function handleSubscriptionRequest(formData: FormData) {
    const requestId = formData.get('requestId') as string;
    const action = formData.get('action') as string; // 'approve' or 'reject'
    const userId = formData.get('userId') as string;
    const tier = formData.get('tier') as string;

    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error("Unauthorized");
        }

        if (action === 'approve') {
            // Default expiry: 30 days from now
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30);

            await prisma.$transaction([
                // Update User Tier and Expiry
                prisma.user.update({
                    where: { id: userId },
                    data: {
                        subscriptionTier: tier,
                        subscriptionExpiry: expiry
                    }
                }),
                // Update Request Status
                prisma.subscriptionRequest.update({
                    where: { id: requestId },
                    data: { status: 'APPROVED' }
                })
            ]);
        } else {
            // Reject
            await prisma.subscriptionRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
        }

        revalidatePath('/admin/users');
        // Removed return for TypeScript compatibility with form actions
    } catch (error: any) {
        console.error("Failed to handle subscription request:", error);
        throw new Error(error.message || "Failed to process request");
    }
}
