'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { authenticateAdmin } from '@/app/actions/admin-login';

export default function AdminLoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticateAdmin, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] bg-center opacity-5 pointer-events-none" />
            <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 shadow-2xl rounded-2xl relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">إدارة رادار الذهب</h2>
                    <p className="mt-2 text-sm text-slate-400">الرجاء تسجيل الدخول للوصول إلى لوحة التحكم</p>
                </div>
                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-slate-300 mb-1">اسم المستخدم / البريد الإلكتروني</label>
                            <input
                                id="email-address"
                                name="email"
                                type="text"
                                autoComplete="username"
                                required
                                className="relative block w-full rounded-md border-0 bg-slate-800 p-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                                placeholder="admin"
                                dir="ltr"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-md border-0 bg-slate-800 p-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
                                placeholder="••••••••"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-400 w-full text-center bg-red-400/10 p-2 rounded">{errorMessage}</p>
                        )}
                    </div>

                    <Button className="w-full mt-4 bg-amber-500 text-slate-900 hover:bg-amber-600 font-bold" type="submit">
                        دخول للإدارة
                    </Button>

                    <div className="text-sm text-center">
                        <Link href="/" className="font-medium text-slate-500 hover:text-slate-300 transition-colors">
                            &larr; العودة للموقع
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
