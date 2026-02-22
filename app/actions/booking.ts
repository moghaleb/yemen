'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestConsultation(formData: FormData) {
    const topic = formData.get("topic") as string;
    const preferredDate = formData.get("preferredDate") as string;

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

    await prisma.consultationRequest.create({
        data: {
            userId: user.id,
            topic: topic || "استشارة عامة",
            preferredDate: preferredDate || null,
            status: "PENDING"
        }
    });

    revalidatePath('/booking');
    return { success: true, message: "تم إرسال طلب الاستشارة بنجاح. سنتواصل معك قريباً." };
}

export async function updateConsultationStatus(id: string, status: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, message: "غير مصرح لك بالقيام بهذا الإجراء" };
    }

    await prisma.consultationRequest.update({
        where: { id },
        data: { status }
    });

    revalidatePath('/admin/consultations');
    return { success: true, message: "تم تحديث حالة الطلب" };
}
