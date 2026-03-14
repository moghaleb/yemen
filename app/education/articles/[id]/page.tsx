import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Share2, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { hasAccess } from "@/lib/permissions";

interface ArticleDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
    const { id } = await params;
    const session = await auth();
    let userTier = 'FREE';

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { subscriptionTier: true, role: true } });
        if (user) userTier = user.role === 'ADMIN' ? 'ADMIN' : user.subscriptionTier;
    }

    const article = await prisma.educationalContent.findUnique({
        where: { id },
    });

    if (!article || (article.type !== "ARTICLE" && article.type !== "ANALYSIS")) {
        notFound();
    }

    const isLocked = article.isPremium && !hasAccess(userTier, 'BASIC'); // Basic and VIP can see premium education

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 pb-20">
            <header className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={article.type === 'ANALYSIS' ? (article.category === 'GOLD' ? '/gold' : article.category === 'STOCK' ? '/stocks' : '/education/articles') : '/education/articles'}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold">{article.type === 'ANALYSIS' ? 'التحليل الفني' : 'قراءة المقال'}</h1>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                    <Share2 className="w-4 h-4" />
                </Button>
            </header>

            <main className="container max-w-3xl py-8 px-4">
                <article className="space-y-6">
                    <header className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-none">
                                {article.category === 'GOLD' ? 'ذهب' : article.category === 'STOCK' ? 'أسهم' : 'عام'}
                            </Badge>
                            {article.isPremium && (
                                <Badge variant="outline" className="border-amber-500 text-amber-500 font-bold">
                                    Premium 🔒
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold leading-tight md:text-4xl text-white">{article.title}</h1>
                        <div className="flex items-center text-sm text-slate-400 gap-4">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(article.createdAt).toLocaleDateString('ar-EG')}
                            </span>
                            <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {article.type === 'ANALYSIS' ? 'تحليل فني' : 'مقال تعليمي'}
                            </span>
                        </div>
                    </header>

                    <div className="prose prose-invert prose-slate max-w-none mt-8">
                        <p className="text-xl leading-relaxed text-slate-300 italic mb-8 border-r-4 border-amber-500 pr-4 py-2 bg-white/5">
                            {article.summary}
                        </p>

                        {isLocked ? (
                            <div className="bg-slate-900 text-white rounded-2xl p-10 text-center space-y-6 my-12 border border-slate-800 shadow-2xl">
                                <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-4 animate-pulse">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">هذا المقال حصري للمشتركين</h3>
                                <p className="text-slate-400 max-w-sm mx-auto">
                                    المحتوى التعليمي المتقدم متاح فقط لأصحاب الباقات المدفوعة (العادية و VIP).
                                </p>
                                <div className="flex flex-col gap-3 pt-4">
                                    <Link href="/subscribe">
                                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-6 rounded-xl text-lg w-full">
                                            ترقية الحساب الآن
                                        </Button>
                                    </Link>
                                    <Link href="/education/articles">
                                        <Button variant="ghost" className="text-slate-400 hover:text-white">
                                            العودة للمقالات المجانية
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap leading-loose text-lg text-slate-100">
                                {article.content || "سيتم إضافة محتوى المقال قريباً."}
                            </div>
                        )}
                    </div>
                </article>
            </main>
        </div>
    );
}
