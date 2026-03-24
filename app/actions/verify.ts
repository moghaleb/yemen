'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function verifyOTP(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;

    if (!email || !code) {
        return { message: 'البيانات غير مكتملة', success: false };
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, otpCode: true, otpExpires: true, emailVerified: true }
    });

    if (!user) {
        return { message: 'المستخدم غير موجود', success: false };
    }

    if (user.emailVerified) {
        // Already verified
        redirect('/login?verified=true');
    }

    if (!user.otpCode || !user.otpExpires) {
        return { message: 'لا يوجد رمز تحقق نشط لهذا الحساب', success: false };
    }

    if (new Date() > user.otpExpires) {
        return { message: 'رمز التحقق منتهي الصلاحية. يرجى طلب رمز جديد', success: false };
    }

    if (user.otpCode !== code.trim()) {
        return { message: 'رمز التحقق غير صحيح', success: false };
    }

    // Success! Update user
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            otpCode: null,
            otpExpires: null
        }
    });

    // Send successful redirect
    redirect('/login?verified=true');
}

export async function resendOTP(email: string) {
    if (!email) return { message: 'البريد الإلكتروني مفقود', success: false };

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, emailVerified: true }
    });

    if (!user) return { message: 'المستخدم غير موجود', success: false };
    if (user.emailVerified) return { message: 'الحساب مفعل مسبقاً', success: false };

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpires }
    });

    const { sendVerificationEmail } = await import('@/lib/email');
    await sendVerificationEmail(email, otpCode);

    return { message: 'تم إعادة إرسال الرمز بنجاح', success: true };
}
