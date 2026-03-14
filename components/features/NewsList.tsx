import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import Link from "next/link";

interface NewsItemProps {
    id: string;
    title: string;
    summary: string;
    content?: string | null;
    impact: string;
    publishedAt: Date;
    isLocked?: boolean;
}

interface NewsListProps {
    news: NewsItemProps[];
}

export default function NewsList({ news }: NewsListProps) {
    return (
        <div className="space-y-4">
            {news.length > 0 ? (
                news.map((item) => (
                    <Link href={`/news/${item.id}`} key={item.id} className="block">
                        <Card className="overflow-hidden hover:bg-slate-50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.publishedAt))}
                                            </Badge>
                                            <Badge
                                                className={
                                                    item.impact === "HIGH" ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200" :
                                                        item.impact === "MEDIUM" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200" :
                                                            "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                                                }
                                            >
                                                {item.impact === "HIGH" ? "تأثير عالي" : item.impact === "MEDIUM" ? "تأثير متوسط" : "تأثير منخفض"}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-lg leading-tight flex items-center gap-2">
                                            {item.title}
                                            {item.isLocked && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">VIP</span>}
                                        </h3>
                                        {item.isLocked ? (
                                            <div className="bg-slate-50 border border-slate-100 rounded p-3 mt-2">
                                                <p className="text-sm text-slate-400 blur-[2px] select-none">
                                                    هذا المحتوى محجوب للمشتركين فقط. قم بالترقية لقراءة التفاصيل الكاملة والتحليلات.
                                                </p>
                                                <p className="text-xs text-amber-600 font-bold mt-2">🔒 محتوى حصري للمشتركين</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/50">
                                        <Newspaper className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            ) : (
                <p className="text-center text-muted-foreground py-10">لا توجد أخبار متاحة حالياً.</p>
            )}
        </div>
    );
}
