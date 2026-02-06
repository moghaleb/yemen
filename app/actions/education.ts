'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEducationalContent(formData: FormData) {
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const summary = formData.get('summary') as string;
    const url = formData.get('url') as string;
    const isPremium = formData.get('isPremium') === 'on';

    if (!title || !type || !summary) {
        throw new Error('Missing required fields');
    }

    await prisma.educationalContent.create({
        data: {
            title,
            type,
            summary,
            url,
            isPremium,
        },
    });

    revalidatePath('/admin/education');
    revalidatePath('/education/videos');
    revalidatePath('/education/articles');
}

export async function deleteEducationalContent(formData: FormData) {
    const id = formData.get('id') as string;

    if (!id) return;

    await prisma.educationalContent.delete({
        where: { id },
    });

    revalidatePath('/admin/education');
    revalidatePath('/education/videos');
    revalidatePath('/education/articles');
}
