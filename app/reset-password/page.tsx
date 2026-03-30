'use client';

import { executePasswordReset } from '@/app/actions/reset-password';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full mt-4" type="submit" disabled={pending}>
            {pending ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
        </Button>
    );
}

const initialState = {
    message: '',
    isError: false,
    isSuccess: false
};

function ResetPasswordForm() {
    const [state, formAction] = useActionState(executePasswordReset, initialState);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        return (
            <div className="text-center p-4">
                <p className="text-red-500 mb-4">الرابط غير صالح أو غير مكتمل.</p>
                <Link href="/forgot-password" className="text-indigo-600">طلب رابط جديد</Link>
            </div>
        );
    }

    if (state?.isSuccess) {
        return (
            <div className="text-center p-4">
                <p className="text-green-600 font-bold text-lg mb-4">{state.message}</p>
                <Link href="/login">
                    <Button className="w-full">الانتقال لتسجيل الدخول</Button>
                </Link>
            </div>
        );
    }

    return (
        <form action={formAction} className="mt-8 space-y-6">
            <input type="hidden" name="token" value={token} />
            
            <div className="rounded-md shadow-sm">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="********"
                    />
                </div>
            </div>

            {state?.message && !state?.isSuccess && (
                <div className={`p-4 rounded-md text-sm ${state.isError ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>
                    {state.message}
                </div>
            )}

            <SubmitButton />
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">إعادة تعيين كلمة المرور</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        الرجاء إدخال كلمة المرور الجديدة الخاصة بك
                    </p>
                </div>

                <Suspense fallback={<div className="text-center py-4">جاري التحميل...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
