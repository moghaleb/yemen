'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestSubscription(data: FormData | string) {
    let tier: string;

    if (typeof data === 'string') {
        tier = data;
    } else {
        tier = data.get("tier") as string;
    }

    const session = await auth();
    if (!session?.user?.email) {
        return { success: false, message: "يجب عليك تسجيل الدخول أولاً" };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return { success: false, message: "المستخدم غير موجود" };
    }

    // Check for existing pending request
    const existingRequest = await prisma.subscriptionRequest.findFirst({
        where: {
            userId: user.id,
            status: "PENDING"
        }
    });

    if (existingRequest) {
        return { success: false, message: "لديك طلب اشتراك قيد المراجعة بالفعل" };
    }

    await prisma.subscriptionRequest.create({
        data: {
            userId: user.id,
            requestedTier: tier,
            status: "PENDING"
        }
    });

    revalidatePath('/');
    return { success: true, message: "تم إرسال طلب الاشتراك بنجاح سيتم التواصل معك قريباً" };
}
