import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Share2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const articles = [
    {
        id: 1,
        title: "فهم اتجاهات سوق الذهب",
        summary: "تعرف على أساسيات ما يحرك أسعار الذهب وكيفية تفسير إشارات السوق.",
        readTime: "5 دقائق للقراءة",
        tag: "مبتدئ"
    },
    {
        id: 2,
        title: "الاستثمار في سوق الأسهم 101",
        summary: "دليل شامل للمبتدئين لبدء رحلتهم في تداول الأسهم.",
        readTime: "8 دقائق للقراءة",
        tag: "استثمار"
    },
    {
        id: 3,
        title: "استراتيجيات إدارة المخاطر",
        summary: "كيف تحمي رأس مالك وتدير المخاطر بفعالية أثناء التداول.",
        readTime: "6 دقائق للقراءة",
        tag: "متقدم"
    }
];

export default function ArticlesPage() {
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
                                <Badge variant="secondary" className="mb-2">{article.tag}</Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <BookOpen className="w-3 h-3 mr-1" /> {article.readTime}
                                </span>
                            </div>
                            <CardTitle className="text-lg">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {article.summary}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="w-full">قراءة المقال</Button>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </main>
        </div>
    );
}
