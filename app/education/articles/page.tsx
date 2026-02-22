import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Share2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
    const articles = await prisma.educationalContent.findMany({
        where: { type: "ARTICLE" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">المقالات التعليمية</h1>
            </header>

            <main className="container flex-1 py-6 px-4 space-y-4">
                {articles.map((article) => (
                    <Card key={article.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="mb-2">
                                        {article.category === 'GOLD' ? 'ذهب' : article.category === 'STOCK' ? 'أسهم' : 'عام'}
                                    </Badge>
                                    {article.isPremium && <Badge variant="outline" className="mb-2 border-amber-500 text-amber-500">Premium</Badge>}
                                </div>
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <BookOpen className="w-3 h-3 mr-1" /> {new Date(article.createdAt).toLocaleDateString('ar-EG')}
                                </span>
                            </div>
                            <CardTitle className="text-lg">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                {article.summary}
                            </p>
                            <div className="flex gap-2">
                                <Link href={`/education/articles/${article.id}`} className="w-full">
                                    <Button variant="outline" size="sm" className="w-full">قراءة المقال</Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {articles.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>لا توجد مقالات منشورة حالياً.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
