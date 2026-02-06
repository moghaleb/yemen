import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Video } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">حجز استشارة</h1>
            </header>

            <main className="container flex-1 py-6 px-4 space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">استشارة الخبراء</h2>
                    <p className="text-muted-foreground">احجز جلسة فردية مع خبراء السوق لدينا.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>تفاصيل الجلسة</CardTitle>
                        <CardDescription>استشارة خاصة لمدة 30 دقيقة عبر زووم.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>الأيام المتاحة: الاثنين - الجمعة</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-5 h-5 text-primary" />
                            <span>المدة: 30 دقيقة</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Video className="w-5 h-5 text-primary" />
                            <span>المنصة: Zoom / Google Meet</span>
                        </div>

                        <div className="pt-4">
                            <Button className="w-full" size="lg">اختر التاريخ والوقت</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>لماذا تحجز؟</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                            <li>مراجعة مخصصة لمحفظتك</li>
                            <li>استراتيجية إدارة المخاطر</li>
                            <li>تحليل فني لأصولك</li>
                        </ul>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
