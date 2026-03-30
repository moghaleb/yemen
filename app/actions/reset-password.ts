'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { message: 'يرجى إدخال البريد الإلكتروني', success: false };
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, emailVerified: true }
    });

    if (!user) {
        // Obscure existence for security, still say sent.
        redirect(`/reset-password?email=${encodeURIComponent(email)}`);
    }

    if (!user.emailVerified) {
        return { message: 'يجب تأكيد البريد الإلكتروني أولاً قبل استعادة كلمة المرور', success: false };
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Save to DB
    await prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpires }
    });

    // Send the email
    const { sendPasswordResetEmail } = await import('@/lib/email');
    await sendPasswordResetEmail(email, otpCode);

    redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

export async function confirmPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!email || !code || !password || !confirmPassword) {
        return { message: 'جميع الحقول مطلوبة', success: false };
    }

    if (password !== confirmPassword) {
        return { message: 'كلمات المرور لا تتطابق', success: false };
    }

    if (password.length < 5) {
        return { message: 'كلمة المرور يجب أن تكون 5 أحرف على الأقل', success: false };
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, otpCode: true, otpExpires: true }
    });

    if (!user || user.otpCode !== code.trim()) {
        return { message: 'الرمز السري غير صحيح', success: false };
    }

    if (!user.otpExpires || new Date() > user.otpExpires) {
        return { message: 'انتهت صلاحية الرمز، يرجى طلب رمز جديد', success: false };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user: change password, clear OTP, increment session version to log out old sessions
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            otpCode: null,
            otpExpires: null,
            sessionVersion: { increment: 1 }
        }
    });

    // Success! Redirect directly to login with ?reset=true flag
    redirect('/login?reset=true');
}
