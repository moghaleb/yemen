'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useActionState } from 'react';
import { signIn } from 'next-auth/react'; // Client side sign in
// Wait, for credentials provider, we can't easily use next-auth/react signIn with server actions directly for UI feedback without client component.
// Actually, creating a server action that calls signIn is cleaner in v5, but purely client side 'signIn' works well too.
// Let's stick to a client form that calls a server action wrapper OR authenticates via API route.
// V5 recommended way: Server Action that calls signIn.

// Let's create a login action or use the client method. Client method is easier for error handling on the UI sometimes.
// But we want to be consistent. Let's make a login action.

/*
 But 'signIn' from 'next-auth/react' is the standard way for client components.
 Let's use a server action wrapper for login.
 */

// We need a server action for login to call existing 'signIn' from 'auth.ts' if we use server-side auth.
// But 'signIn' from 'auth' is server-side only. 
// Let's stick to client-side for now or import 'signIn' from 'next-auth/react' if we are in client component.
// The code below uses a form that submits to a server action.

import { authenticate } from '@/app/actions/login'; // We need to create this

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">تسجيل الدخول</h2>
                </div>
                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        )}
                    </div>

                    <Button className="w-full mt-4" type="submit">
                        تسجيل الدخول
                    </Button>

                    <div className="text-sm text-center">
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            ليس لديك حساب؟ إنشاء حساب جديد
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
