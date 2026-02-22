"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Crown, Star, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { requestSubscription } from "@/app/actions/subscription";

function ConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tier = searchParams.get("tier");
    const [senderName, setSenderName] = useState("");
    const [transferNumber, setTransferNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const planInfo = {
        VIP: { name: "VIP", color: "text-[#D4AF37]", icon: Crown, price: "100$" },
        BASIC: { name: "الأساسية", color: "text-cyan-400", icon: Star, price: "50$" }
    }[tier as "VIP" | "BASIC"] || { name: tier, color: "text-white", icon: CheckCircle2, price: "---" };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("tier", tier || "");
            formData.append("senderName", senderName);
            formData.append("transferNumber", transferNumber);

            const result = await requestSubscription(formData);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => router.push("/"), 3000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-white">تم إرسال طلبك بنجاح!</h1>
                <p className="text-slate-400 max-w-md mx-auto">
                    تم استلام بيانات التحويل بنجاح. سيقوم فريقنا بمراجعة الطلب وتفعيل اشتراكك في أقرب وقت ممكن.
                </p>
                <p className="text-sm text-slate-500 animate-pulse">سيتم تحويلك للصفحة الرئيسية تلقائياً...</p>
                <Button onClick={() => router.push("/")} variant="outline" className="mt-4">
                    العودة للرئيسية الآن
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12" dir="rtl">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-white/5 pb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">تأكيد الاشتراك</h1>
                    <div className="w-10"></div>
                </header>

                <main className="grid md:grid-cols-5 gap-12">
                    {/* Plan Summary Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 sticky top-12">
                            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${planInfo.color}`}>
                                <planInfo.icon className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-400">الباقة المختارة</h2>
                                <p className={`text-4xl font-black mt-1 ${planInfo.color}`}>باقة {planInfo.name}</p>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-lg">
                                    <span className="text-slate-400">السعر الشهري</span>
                                    <span className="font-bold">{planInfo.price}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-slate-400">مدة الاشتراك</span>
                                    <span className="font-bold">30 يوم</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="md:col-span-3 space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold">بيانات التحويل</h2>
                            <p className="text-slate-400 line-height-relaxed">
                                يرجى إدخال البيانات الموجودة في إيصال التحويل لضمان سرعة تفعيل حسابك.
                            </p>
                        </section>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 mr-2">اسم المرسل بالكامل</label>
                                <input
                                    type="text"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    placeholder="أدخل الاسم كما في الحوالة"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all text-xl"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 mr-2">رقم الحوالة (المرجع)</label>
                                <input
                                    type="text"
                                    value={transferNumber}
                                    onChange={(e) => setTransferNumber(e.target.value)}
                                    placeholder="أدخل رقم العملية أو الحوالة"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all text-xl font-mono"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] text-black font-black h-16 text-xl rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-3 border-black border-t-transparent animate-spin rounded-full" />
                                            جاري إرسال الطلب...
                                        </div>
                                    ) : "تأكيد وإرسال البيانات"}
                                </Button>
                                <p className="text-center text-xs text-slate-500 mt-6">
                                    بالضغط على تأكيد، أنت توافق على شروط وأحكام الاشتراك.
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function ConfirmSubscriptionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">جاري التحميل...</div>}>
            <ConfirmContent />
        </Suspense>
    );
}
