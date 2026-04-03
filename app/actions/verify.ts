'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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

    // Delegate verification and automatic login to NextAuth
    try {
        await signIn('credentials', {
            email,
            otpCode: code,
            redirect: false
        });
    } catch (error: any) {
        if (error instanceof AuthError || error.type === 'CredentialsSignin') {
            return { message: 'رمز التحقق غير صحيح أو منتهي الصلاحية', success: false };
        }
        // signIn throws NEXT_REDIRECT on success, let it happen if it does
        throw error;
    }

    // Fallback redirect if `redirect: false` actually succeeds (it usually throws NEXT_REDIRECT anyway)
    redirect('/');
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
