import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Search, Target, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -z-10" />

            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-white/10 p-4 flex items-center justify-between">
                <Link href="/account">
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-gradient-gold absolute left-1/2 -translate-x-1/2">من نحن</h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            <main className="container max-w-3xl flex-1 py-8 px-4">
                <div className="glass-card rounded-[30px] p-8 md:p-12 relative overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.05)]">
                    
                    {/* Logo/Icon Area */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black/50 border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)] relative">
                            <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                            <Info className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="space-y-8 text-slate-300 leading-relaxed text-lg text-justify">
                        
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 shrink-0 bg-[#D4AF37]/10 p-2 rounded-lg text-[#D4AF37]">
                                <Search className="w-5 h-5" />
                            </div>
                            <p>
                                <strong className="text-white text-xl block mb-2 font-bold">خبرة عميقة</strong>
                                نحن فريق متخصص من المحللين في أسواق المال، نمتلك خبرة تتجاوز 15 عامًا في مجال تحليل وتداول الذهب والأسواق المالية. على مدار هذه السنوات، اكتسبنا معرفة عميقة في قراءة تحركات السوق وفهم العوامل الاقتصادية التي تؤثر على أسعار الذهب عالميًا.
                            </p>
                        </div>

                        <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                            <div className="mt-1 shrink-0 bg-cyan-500/10 p-2 rounded-lg text-cyan-400">
                                <Target className="w-5 h-5" />
                            </div>
                            <p>
                                <strong className="text-white text-xl block mb-2 font-bold">دقة مستمرة</strong>
                                يهدف موقعنا إلى تقديم تحليلات دقيقة، وتوصيات مبنية على أسس فنية وعلمية، لمساعدة كل من يهتم بالتجارة والاستثمار في الذهب على اتخاذ قرارات أكثر وعيًا. نحن نعمل باستمرار على متابعة السوق لحظة بلحظة، وتقديم محتوى محدث يشمل التحليل الفني، التوقعات، وأهم فرص الشراء والبيع.
                            </p>
                        </div>

                        <p className="text-center font-medium text-amber-100/80 italic text-xl px-4">
                            "نؤمن أن النجاح في تجارة الذهب يعتمد على المعرفة والانضباط، لذلك نسعى إلى تبسيط المعلومات وتقديمها بطريقة واضحة ومفيدة لجميع المستخدمين، سواء كانوا مبتدئين أو محترفين."
                        </p>

                        <div className="flex gap-4 items-start pt-4 border-t border-white/5">
                            <div className="mt-1 shrink-0 bg-green-500/10 p-2 rounded-lg text-green-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <p>
                                <strong className="text-white text-xl block mb-2 font-bold">مصداقية وشفافية</strong>
                                نلتزم بالشفافية والمصداقية في كل ما نقدمه، مع التأكيد على أن جميع التحليلات والتوصيات هي لأغراض تعليمية وإرشادية فقط، ولا تمثل نصائح استثمارية ملزمة. هدفنا هو أن نكون مصدرًا موثوقًا لكل من يبحث عن فهم أعمق لسوق الذهب واتخاذ قرارات استثمارية مبنية على تحليل سليم.
                            </p>
                        </div>

                    </div>
                    
                </div>
                
                {/* Footer simple branding */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    رادار الذهب © {new Date().getFullYear()}
                </div>
            </main>
        </div>
    );
}
