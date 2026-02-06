import RecommendationCard from "@/components/features/RecommendationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hasAccess } from "@/lib/permissions";

export const dynamic = 'force-dynamic';

function formatTime(date: Date) {
    return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default async function RecommendationsPage() {
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

    // Fetch active recommendations
    const activeRecs = await prisma.recommendation.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
    });

    const goldRecs = activeRecs.filter(r => r.type === "GOLD");
    const stockRecs = activeRecs.filter(r => r.type === "STOCK");

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">التوصيات</h1>
            </header>

            <main className="container flex-1 py-6 px-4">
                <Tabs defaultValue="gold" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="gold">ذهب (XAU)</TabsTrigger>
                        <TabsTrigger value="stocks">أسهم</TabsTrigger>
                    </TabsList>

                    <TabsContent value="gold" className="space-y-4">
                        {goldRecs.length > 0 ? (
                            goldRecs.map((rec) => (
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
                                    isLocked={!hasAccess(userTier, rec.minTier)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>لا توجد توصيات ذهب نشطة حالياً.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="stocks" className="space-y-4">
                        {stockRecs.length > 0 ? (
                            stockRecs.map((rec) => (
                                <RecommendationCard
                                    key={rec.id}
                                    asset={rec.type === 'GOLD' ? "ذهب (XAU/USD)" : "سهم"}
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
                                    isLocked={!hasAccess(userTier, rec.minTier)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>لا توجد توصيات أسهم نشطة حالياً.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
