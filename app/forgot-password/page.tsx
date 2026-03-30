'use client';

import { requestPasswordReset } from '@/app/actions/reset-password';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full mt-4" type="submit" disabled={pending}>
            {pending ? 'جاري الإرسال...' : 'إرسال رابط استعادة'}
        </Button>
    );
}

const initialState = {
    message: '',
    isError: false
};

export default function ForgotPasswordPage() {
    const [state, formAction] = useActionState(requestPasswordReset, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">نسيت كلمة المرور؟</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        أدخل بريدك الإلكتروني لاستلام رابط لإعادة تعيين كلمة المرور
                    </p>
                </div>
                <form action={formAction} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {state?.message && (
                        <div className={`p-4 rounded-md text-sm ${state.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {state.message}
                        </div>
                    )}

                    <SubmitButton />

                    <div className="text-sm text-center">
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
