'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

export async function registerUser(formData: FormData) {
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

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'FREE',
        },
    });

    // Auto-login after registration
    await signIn('credentials', {
        email,
        password,
        redirectTo: '/'
    });
}
