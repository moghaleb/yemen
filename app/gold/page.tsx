import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Newspaper, TrendingUp, BookOpen, AlertCircle } from "lucide-react";
import RecommendationCard from "@/components/features/RecommendationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { hasAccess } from "@/lib/permissions";

export const dynamic = 'force-dynamic';

function formatTime(date: Date) {
    return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default async function GoldDashboard() {
    const session = await auth();
    let userTier = "FREE";

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { subscriptionTier: true, role: true }
        });
        if (user) {
            userTier = user.role === 'ADMIN' ? 'ADMIN' : user.subscriptionTier;
        }
    }

    // 1. Fetch Analysis (EducationalContent where type=ANALYSIS & category=GOLD)
    const analysis = await prisma.educationalContent.findMany({
        where: { type: 'ANALYSIS', category: 'GOLD' },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    // 2. Fetch Active Gold Recommendations
    const recommendations = await prisma.recommendation.findMany({
        where: { type: 'GOLD', status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
    });

    // 3. Fetch Gold News (Gated Fetch)
    const allNews = await prisma.newsItem.findMany({
        where: { category: 'GOLD' },
        orderBy: { publishedAt: 'desc' },
        take: 10
    });
    const news = allNews.filter(item => hasAccess(userTier, item.minTier));

    // 4. Fetch Gold Articles
    const articles = await prisma.educationalContent.findMany({
        where: { type: 'ARTICLE', category: 'GOLD' },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-amber-500 text-white p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:20px_20px] opacity-20"></div>
                <div className="container relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/">
                            <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white p-2 h-auto rounded-full">
                                <ArrowRight className="w-6 h-6" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">لوحة الذهب (XAU/USD)</h1>
                    </div>
                    <p className="opacity-90 max-w-xl">
                        وجهتك الشاملة لكل ما يخص الذهب: تحليلات فنية، توصيات بيع وشراء، وأخبار عاجلة تؤثر على السوق.
                    </p>
                </div>
            </header>

            <main className="container px-4 py-6 -mt-6 relative z-20">
                <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white rounded-xl shadow-sm mb-6">
                        <TabsTrigger value="analysis" className="flex flex-col gap-1 py-3 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-xs font-bold">التحليل</span>
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex flex-col gap-1 py-3 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-xs font-bold">التوصيات</span>
                        </TabsTrigger>
                        <TabsTrigger value="news" className="flex flex-col gap-1 py-3 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
                            <Newspaper className="w-5 h-5" />
                            <span className="text-xs font-bold">الأخبار</span>
                        </TabsTrigger>
                        <TabsTrigger value="articles" className="flex flex-col gap-1 py-3 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-xs font-bold">المقالات</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* 1. Analysis Tab */}
                    <TabsContent value="analysis" className="space-y-4">
                        {analysis.length > 0 ? (
                            <div className="grid gap-4">
                                {analysis.map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                                        <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                                        <div className="prose prose-sm text-slate-600 mb-3 line-clamp-3">
                                            {item.summary}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span>{formatTime(item.createdAt)}</span>
                                            {item.url && (
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                                                    عرض الكامل &larr;
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                                لا يوجد تحليلات للذهب مضافة حديثاً.
                            </div>
                        )}
                    </TabsContent>

                    {/* 2. Recommendations Tab */}
                    <TabsContent value="recommendations" className="space-y-4">
                        {recommendations.length > 0 ? (
                            recommendations.map((rec) => (
                                <RecommendationCard
                                    key={rec.id}
                                    asset="ذهب (XAU/USD)"
                                    type={rec.action as "BUY" | "SELL" | "HOLD"}
                                    price={rec.price.toString()}
                                    // @ts-ignore
                                    target={rec.takeProfit ? rec.takeProfit.toString() : "-"}
                                    // @ts-ignore
                                    stopLoss={rec.stopLoss ? rec.stopLoss.toString() : "-"}
                                    // @ts-ignore
                                    rationale={rec.rationale || ""}
                                    risk="Medium"
                                    date={formatTime(rec.createdAt)}
                                    // Gating Added Here
                                    isLocked={!hasAccess(userTier, rec.minTier)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                                لا توجد توصيات ذهب نشطة حالياً.
                            </div>
                        )}
                    </TabsContent>

                    {/* 3. News Tab */}
                    <TabsContent value="news" className="space-y-4">
                        {news.length > 0 ? (
                            news.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                                    <div className={`shrink-0 w-1 rounded-full ${item.impact === 'HIGH' ? 'bg-red-500' : item.impact === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'
                                        }`}></div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.summary}</p>
                                        <div className="text-xs text-slate-400">
                                            {formatTime(item.publishedAt)} • {item.source || "مصدر مجهول"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                                لا توجد أخبار ذهب متاحة لاشتراكك الحالي.
                            </div>
                        )}
                    </TabsContent>

                    {/* 4. Articles Tab */}
                    <TabsContent value="articles" className="space-y-4">
                        {articles.length > 0 ? (
                            articles.map((item) => (
                                <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BookOpen className="w-4 h-4 text-amber-500" />
                                        <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                                    </div>
                                    <div className="prose prose-sm text-slate-600 mb-3 line-clamp-3">
                                        {item.summary}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{formatTime(item.createdAt)}</span>
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                                                قراءة المزيد &larr;
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                                لا توجد مقالات تعليمية عن الذهب حالياً.
                            </div>
                        )}
                    </TabsContent>

                </Tabs>
            </main>
        </div>
    );
}
