import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -z-10" />

            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-white/10 p-4 flex items-center justify-between">
                <Link href="/register">
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-gradient-gold absolute left-1/2 -translate-x-1/2">سياسات الموقع</h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            <main className="container max-w-3xl flex-1 py-8 px-4">
                <div className="glass-card rounded-[30px] p-8 md:p-12 relative overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.05)]">
                    
                    {/* Logo/Icon Area */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black/50 border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                            <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                            <ShieldAlert className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-6 text-center">إخلاء المسؤولية وشروط الاستخدام</h2>

                    <div className="space-y-6 text-slate-300 leading-relaxed text-lg text-justify bg-black/20 p-6 rounded-2xl border border-white/5">
                        <p>
                            يقدم هذا الموقع محتوى يهدف إلى التثقيف والمعلومات العامة فقط، بما في ذلك التحليلات والتوصيات والاستشارات المتعلقة بتداول الذهب. <strong className="text-red-400">لا يُعد أي محتوى منشور على الموقع نصيحة استثمارية أو مالية أو قانونية ملزمة.</strong>
                        </p>
                        
                        <p>
                            كما نؤكد أن الموقع لا يشارك المستخدمين في أي أرباح أو خسائر ناتجة عن قراراتهم الاستثمارية، ولا يتحمل أي التزامات مالية أو تعاقدية بهذا الخصوص، حيث تظل جميع النتائج مسؤولية المستخدم وحده.
                        </p>

                        <p className="text-amber-200/90 font-medium pb-2 border-b border-white/10">
                            باستخدامك لهذا الموقع، فإنك تقر وتوافق على هذا الإخلاء من المسؤولية وتحمل كامل المسؤولية عن قراراتك المالية.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
