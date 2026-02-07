'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestSubscription(formData: FormData) {
    const tier = formData.get("tier") as string;

    const session = await auth();
    if (!session?.user?.email) {
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return;
    }

    // Check for existing pending request
    const existingRequest = await prisma.subscriptionRequest.findFirst({
        where: {
            userId: user.id,
            status: "PENDING"
        }
    });

    if (existingRequest) {
        return;
    }

    await prisma.subscriptionRequest.create({
        data: {
            userId: user.id,
            requestedTier: tier,
            status: "PENDING"
        }
    });

    revalidatePath('/');
}
