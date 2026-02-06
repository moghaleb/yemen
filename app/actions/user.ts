'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
