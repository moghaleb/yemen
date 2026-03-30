'use client';

import { Suspense, useState, useRef, useEffect, useActionState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { confirmPasswordReset } from '@/app/actions/reset-password';
import { useFormStatus } from 'react-dom';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || '';
    
    // OTP State
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Form Action State
    const [state, formAction] = useActionState(confirmPasswordReset, { message: '', success: false });

    // Enforce email param
    useEffect(() => {
        if (!email) {
            router.push('/login');
        }
    }, [email, router]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
        const numericData = pastedData.filter(char => /^[0-9]$/.test(char));
        
        if (numericData.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < numericData.length; i++) {
                if (i < 6) newOtp[i] = numericData[i];
            }
            setOtp(newOtp);
            const focusIndex = Math.min(numericData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    return (
        <div className="w-full max-w-md p-8 md:p-10 rounded-[30px] glass-panel border border-[#D4AF37]/20 relative overflow-hidden backdrop-blur-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />

            {/* Header Content */}
            <div className="text-center relative z-10 mb-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black/50 border border-[#D4AF37]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                    <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    <Lock className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border border-[#D4AF37] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">تعيين كلمة مرور جديدة</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                    أدخل الرمز السري المرسل إلى البريد: <br/>
                    <strong className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 mt-1 inline-block" dir="ltr">{email}</strong>
                </p>
            </div>

            {/* Verification Form */}
            <form action={formAction} className="relative z-10 space-y-6">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="code" value={otp.join('')} />

                {state?.message && !state?.success && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm text-center">
                        {state.message}
                    </div>
                )}

                {/* 6-box OTP Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2 pl-2">الرمز السري (6 أرقام)</label>
                    <div className="flex justify-between items-center gap-2" dir="ltr">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black bg-black/40 border-2 rounded-xl text-white transition-all outline-none focus:ring-0 focus:scale-105"
                                style={{ 
                                    borderColor: digit ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                                    boxShadow: digit ? '0 0 15px rgba(212,175,55,0.2)' : 'none'
                                }}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                onPaste={handleOtpPaste}
                                maxLength={1}
                            />
                        ))}
                    </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-4">
                    <div className="space-y-2 text-right">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">كلمة المرور الجديدة</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={5}
                            className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all sm:text-sm"
                            placeholder="********"
                            dir="ltr"
                        />
                    </div>
                    
                    <div className="space-y-2 text-right">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">تأكيد كلمة المرور</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={5}
                            className="block w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all sm:text-sm"
                            placeholder="********"
                            dir="ltr"
                        />
                    </div>
                </div>

                <SubmitButton isComplete={otp.join('').length === 6} />

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

function SubmitButton({ isComplete }: { isComplete: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending || !isComplete}
            className="w-full h-14 rounded-xl font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-90 text-black border-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري تغيير كلمة المرور...
                </>
            ) : (
                'حفظ كلمة المرور'
            )}
        </Button>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 relative">
            <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" /></div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
