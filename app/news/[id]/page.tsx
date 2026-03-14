import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { hasAccess } from "@/lib/permissions";

interface NewsDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { id } = await params;
    const session = await auth();
    let userTier = 'FREE';

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { subscriptionTier: true, role: true } });
        if (user) userTier = user.role === 'ADMIN' ? 'ADMIN' : user.subscriptionTier;
    }

    const newsItem = await prisma.newsItem.findUnique({
        where: { id },
    });

    if (!newsItem) {
        notFound();
    }

    const isLocked = !hasAccess(userTier, newsItem.minTier);

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 pb-20">
            <header className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/news">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold">تفاصيل الخبر</h1>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                    <Share2 className="w-4 h-4" />
                </Button>
            </header>

            <main className="container max-w-3xl py-8 px-4">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Badge
                            variant="outline"
                            className={
                                newsItem.impact === "HIGH" ? "border-red-500 text-red-500" :
                                    newsItem.impact === "MEDIUM" ? "border-yellow-500 text-yellow-500" :
                                        "border-blue-500 text-blue-500"
                            }
                        >
                            {newsItem.impact === "HIGH" ? "تأثير عالي" : newsItem.impact === "MEDIUM" ? "تأثير متوسط" : "تأثير منخفض"}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                            {newsItem.source || "المصدر غير محدد"}
                        </Badge>
                        {newsItem.category !== 'GENERAL' && (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                {newsItem.category === 'GOLD' ? 'ذهب' : 'أسهم'}
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold leading-tight text-white">{newsItem.title}</h1>
                    <div className="flex items-center text-sm text-slate-400 gap-4">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(newsItem.publishedAt))}
                        </span>
                    </div>
                </div>

                <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-xl font-medium text-slate-200 border-r-4 border-amber-500 pr-4 py-3 bg-white/5 mb-8 leading-relaxed">
                        {newsItem.summary}
                    </p>

                    {isLocked ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-6 my-12 shadow-2xl">
                            <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white">هذا الخبر متاح للمشتركين فقط</h3>
                            <p className="text-slate-400 max-w-sm mx-auto">
                                اشترك الآن لتصلك كافة التفاصيل، التحليلات، والتوصيات الحصرية لجميع الباقات.
                            </p>
                            <Link href="/subscribe" className="block pt-4">
                                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-10 py-7 rounded-xl text-lg w-full">
                                    اشترك الآن
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap leading-loose text-lg text-slate-100 dark:text-slate-100">
                            {newsItem.content || "لا توجد تفاصيل إضافية لهذا الخبر في الوقت الحالي."}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
