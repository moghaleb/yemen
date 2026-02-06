import NewsList from "@/components/features/NewsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

import { hasAccess } from "@/lib/permissions";
import { auth } from "@/auth";

// ...

export default async function NewsPage() {
    const session = await auth();
    let userTier = 'FREE';

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { subscriptionTier: true, role: true } });
        if (user) userTier = user.role === 'ADMIN' ? 'ADMIN' : user.subscriptionTier;
    }

    const allNews = await prisma.newsItem.findMany({
        orderBy: { publishedAt: "desc" },
    });

    const news = allNews.map(item => ({
        ...item,
        isLocked: !hasAccess(userTier, item.minTier)
    }));

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">الأخبار الاقتصادية</h1>
            </header>

            <main className="container flex-1 py-6 px-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">أخبار السوق</h2>
                    <p className="text-muted-foreground">آخر التحديثات المؤثرة على الذهب والأسهم.</p>
                </div>
                {/* @ts-ignore */}
                <NewsList news={news} />
            </main>
        </div>
    );
}
