'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '@/lib/email';

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = (formData.get('email') as string)?.trim();

    if (!email) {
        return { message: 'الرجاء إدخال البريد الإلكتروني', isError: true };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Return a generic positive message for security reasons
        return { message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني بنجاح (إذا كان مسجلاً لدينا).', isError: false };
    }

    const unhashedToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
        where: { email },
        data: {
            resetToken: hashedToken,
            resetTokenExpires,
        },
    });

    await sendPasswordResetEmail(email, unhashedToken);

    return { message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني بنجاح (إذا كان مسجلاً لدينا).', isError: false };
}

export async function executePasswordReset(prevState: any, formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;

    if (!token || !password) {
        return { message: 'البيانات غير مكتملة', isError: true, isSuccess: false };
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            resetToken: hashedToken,
            resetTokenExpires: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        return { message: 'الرابط غير صالح أو منتهي الصلاحية', isError: true, isSuccess: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null,
        },
    });

    return { message: 'تم إعادة تعيين كلمة المرور بنجاح!', isError: false, isSuccess: true };
}
