'use client';

import { Suspense, useState, useRef, useEffect, useActionState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { verifyOTP, resendOTP } from '@/app/actions/verify';
import { useFormStatus } from 'react-dom';

function OTPInput() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') || '';
    
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [state, formAction] = useActionState(verifyOTP, { message: '', success: false });

    // Enforce valid email parameter
    useEffect(() => {
        if (!email) {
            router.push('/login');
        }
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Keep last char if user types multiple
        setOtp(newOtp);

        // Auto move to next input if filled
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current is empty, move back
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
        
        // Filter out non-numeric
        const numericData = pastedData.filter(char => /^[0-9]$/.test(char));
        
        if (numericData.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < numericData.length; i++) {
                if (i < 6) newOtp[i] = numericData[i];
            }
            setOtp(newOtp);
            
            // Focus the empty input or the last one
            const focusIndex = Math.min(numericData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setResendMessage('');
        
        try {
            const result = await resendOTP(email);
            setResendMessage(result.message);
        } catch (error) {
            setResendMessage('حدث خطأ. حاول مرة أخرى');
        } finally {
            setIsResending(false);
            setTimeout(() => setResendMessage(''), 5000);
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
                    <Mail className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border border-[#D4AF37] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">تأكيد البريد الإلكتروني</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                    لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى<br/>
                    <strong className="text-white block mt-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">{email}</strong>
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

                {/* 6-box OTP Input container (LTR to keep numbers left-to-right logic) */}
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
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            maxLength={1}
                        />
                    ))}
                </div>

                <SubmitButton isComplete={otp.join('').length === 6} />

                <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-500">لم يصلك الرمز؟</p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="flex items-center gap-2 text-[#D4AF37] hover:text-[#b08d2b] transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        إرسال الرمز مرة أخرى
                    </button>
                    {resendMessage && (
                        <span className="text-xs text-green-400">{resendMessage}</span>
                    )}

                    <Link href="/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mt-2">
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
            className="w-full h-14 rounded-xl font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-90 text-black border-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2"
        >
            {pending ? (
                <>
                    <span className="animate-spin text-2xl">⏳</span>
                    جاري التحقق...
                </>
            ) : (
                'تأكيد الحساب'
            )}
        </Button>
    );
}


export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center px-4 relative">
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                </div>
            }>
                <OTPInput />
            </Suspense>
        </div>
    );
}
