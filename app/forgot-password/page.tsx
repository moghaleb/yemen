'use client';

import { useActionState, Suspense } from 'react';
import { Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/actions/reset-password';
import { useFormStatus } from 'react-dom';

function RequestForm() {
    const [state, formAction] = useActionState(requestPasswordReset, { message: '', success: false });

    return (
        <div className="w-full max-w-md p-8 md:p-10 rounded-[30px] glass-panel border border-[#D4AF37]/20 relative overflow-hidden backdrop-blur-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />

            {/* Header Content */}
            <div className="text-center relative z-10 mb-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black/50 border border-[#D4AF37]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    <KeyRound className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">نسيت كلمة المرور؟</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                    لا تقلق، أدخل بريدك الإلكتروني أدناه وسنرسل لك رمزاً لإعادة تعيين كلمة المرور الخاصة بك.
                </p>
            </div>

            {/* Form */}
            <form action={formAction} className="relative z-10 space-y-6">
                {state?.message && !state?.success && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm text-center">
                        {state.message}
                    </div>
                )}
                {state?.message && state?.success && (
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-200 text-sm text-center">
                        {state.message}
                    </div>
                )}

                <div className="space-y-2 text-right">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">البريد الإلكتروني</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full pl-3 pr-10 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all sm:text-sm"
                            placeholder="mail@example.com"
                            dir="ltr"
                        />
                    </div>
                </div>

                <SubmitButton />

                <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-white/10">
                    <Link href="/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        العودة لتسجيل الدخول
                        <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </form>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full h-14 rounded-xl font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-90 text-black border-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإرسال...
                </>
            ) : (
                'إرسال رمز الاستعادة'
            )}
        </Button>
    );
}

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 relative">
            <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" /></div>}>
                <RequestForm />
            </Suspense>
        </div>
    );
}
