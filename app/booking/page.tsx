"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Video, Send, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { requestConsultation } from "@/app/actions/booking";

export default function BookingPage() {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleBooking = async (formData: FormData) => {
        setError("");
        startTransition(async () => {
            const result = await requestConsultation(formData);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
            }
        });
    };

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-background pb-20 items-center justify-center p-4 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">تم استلام طلبك!</h2>
                <p className="text-muted-foreground max-w-sm">
                    شكراً لطلبك استشارة. سيقوم فريقنا بمراجعة الطلب والتواصل معك عبر البريد الإلكتروني لتحديد الموعد النهائي.
                </p>
                <Link href="/">
                    <Button variant="outline" className="mt-4">العودة للرئيسية</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20" dir="rtl">
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">حجز استشارة</h1>
            </header>

            <main className="container flex-1 py-6 px-4 space-y-6 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F5E0A3] bg-clip-text text-transparent">استشارة الخبراء</h2>
                    <p className="text-muted-foreground">احجز جلسة فردية مع خبراء السوق لدينا لتحليل محفظتك واستراتيجيتك.</p>
                </div>

                <div className="grid gap-6">
                    <Card className="border-primary/20 bg-secondary/10">
                        <CardHeader>
                            <CardTitle>تفاصيل الجلسة</CardTitle>
                            <CardDescription>استشارة خاصة لمدة 30 دقيقة عبر زووم أو جوجل ميت.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span>الأيام المتاحة: الأحد - الخميس</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>المدة: 30 دقيقة من التحليل العميق</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Video className="w-5 h-5 text-primary" />
                                <span>المنصة: Zoom / Google Meet</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>طلب الاستشارة</CardTitle>
                            <CardDescription>أخبرنا عن موضوع الاستشارة والتاريخ المفضل لك.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handleBooking} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">موضوع الاستشارة</label>
                                    <textarea
                                        name="topic"
                                        placeholder="مثلاً: تحليل محفظة ذهب، استراتيجية تداول الأسهم..."
                                        className="w-full min-h-[100px] p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">التاريخ والوقت المفضل (اختياري)</label>
                                    <input
                                        type="text"
                                        name="preferredDate"
                                        placeholder="مثلاً: الثلاثاء القادم الساعة 4 مساءً"
                                        className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>

                                {error && <p className="text-destructive text-sm">{error}</p>}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 ml-2" />
                                            إرسال طلب الحجز
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="pt-4">
                    <h3 className="font-bold mb-3">ماذا ستحصل عليه في الجلسة؟</h3>
                    <div className="grid gap-3">
                        {[
                            "مراجعة مخصصة لمحفظتك المالية الحالية",
                            "بناء استراتيجية إدارة مخاطر تناسب ميزانيتك",
                            "تحليل فني مباشر لأهم الأصول التي تهتم بها",
                            "نصائح حول كيفية اقتناص الفرص في السوق اليمني والإقليمي"
                        ].map((text, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

