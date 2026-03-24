'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sendVerificationEmail } from '@/lib/email';

export async function registerUser(prevState: any, formData: FormData) {
    const name = (formData.get('name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();

    if (!email || !password) {
        return { message: 'يجب ملء جميع الحقول' };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { message: 'البريد الإلكتروني مستخدم بالفعل' };
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Note: The User model in schema.prisma currently only has email, password, role.
    // Ideally we should add 'name' to the User model, but for now we'll update the schema or just ignore name.
    // Let's stick to the existing schema first to avoid migration issues immediately, or safer: update schema.

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'USER',
            otpCode,
            otpExpires
        },
    });

    // Send verification email
    await sendVerificationEmail(email, otpCode);

    // Redirect to verification page
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}
