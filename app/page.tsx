
import NewsTicker from "@/components/features/NewsTicker";
import SubscriptionTicker from "@/components/features/SubscriptionTicker";
import RecommendationCard from "@/components/features/RecommendationCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Newspaper, PlayCircle, BookOpen, ArrowLeft, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { hasAccess } from "@/lib/permissions";

// Helper to format date relative or absolute
function formatTime(date: Date) {
  return new Intl.DateTimeFormat('ar-EG', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();

  // Fetch latest active recommendation
  const latestRec = await prisma.recommendation.findFirst({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  // Fetch news
  const latestNews = await prisma.newsItem.findMany({
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  // Fetch fresh user data for permissions
  let userTier = 'FREE';
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionTier: true, role: true }
    });
    if (user) {
      userTier = user.role === 'ADMIN' ? 'ADMIN' : user.subscriptionTier;
    }
  }

  // Check access for recommendation
  // @ts-ignore
  const recIsLocked = latestRec ? !hasAccess(userTier, latestRec.minTier) : false;

  // Check access for news
  const visibleNews = latestNews.map(item => ({
    ...item,
    isLocked: !hasAccess(userTier, item.minTier)
  }));

  return (
    <div className="flex flex-col min-h-screen pb-20 overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-[100%] blur-[100px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-500/5 rounded-[100%] blur-[120px] -z-10" />

        <div className="container px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/30 text-primary text-xs font-bold mb-6 animate-float">
            <Zap className="w-3 h-3 fill-current" />
            <span>الجيل القادم من التداول</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="text-foreground">قوة </span>
            <span className="text-gradient-cyan">الذكاء الاصطناعي </span>
            <br />
            <span className="text-gradient-gold">بين يديك</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            تداول بثقة وتحكم بقراراتك مع إشارات دقيقة مدعومة بالذكاء الاصطناعي، وتنبيهات لحظية على جوالك للذهب والأسهم.
          </p>

          <div className="flex items-center justify-center gap-4">
            {session?.user ? (
              <Link href="/gold">
                <Button variant="glow" size="lg" className="rounded-full px-8">
                  لوحة الذهب
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button variant="glow" size="lg" className="rounded-full px-8">
                  ابـدأ الآن مجاناً
                </Button>
              </Link>
            )}
            <Link href="/education/articles">
              <Button variant="glass" size="lg" className="rounded-full px-8">
                تعلم المزيد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container px-4 space-y-8">

        {/* Ticker */}
        <div className="space-y-4">
          {/* Glassy News Ticker */}
          <div className="glass rounded-xl overflow-hidden py-1">
            <NewsTicker />
          </div>
        </div>

        {/* Gold Dashboard Card (Premium) */}
        <Link href="/gold" className="block transform hover:scale-[1.02] transition-all duration-300 group">
          <div className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <div className="absolute inset-0 bg-black/80 m-[1px] rounded-[23px] z-0" />
            <div className="relative z-10 bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-[22px] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black">PREMIUM</span>
                  <h2 className="text-2xl font-bold text-amber-500">لوحة الذهب (XAU/USD)</h2>
                </div>
                <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">تحليل فني متقدم • مناطق شراء وبيع • أخبار وتنبيهات لحظية</p>
              </div>

              <div className="relative w-16 h-16 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                <ArrowLeft className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Subscription Ticker */}
        <SubscriptionTicker />

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recommendation Card */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>توصية اليوم</span>
            </h2>
            {latestRec ? (
              <RecommendationCard
                asset={latestRec.type === 'GOLD' ? 'ذهب (XAU/USD)' : 'أسهم'}
                type={latestRec.action as "BUY" | "SELL" | "HOLD"}
                price={latestRec.price.toString()}
                // @ts-ignore
                target={latestRec.takeProfit ? latestRec.takeProfit.toString() : "-"}
                // @ts-ignore
                stopLoss={latestRec.stopLoss ? latestRec.stopLoss.toString() : "-"}
                // @ts-ignore
                rationale={latestRec.rationale || ""}
                risk="Medium" // Default
                date={`اليوم، ${formatTime(latestRec.createdAt)}`}
                isLocked={recIsLocked}
              />
            ) : (
              <div className="h-40 glass-card rounded-2xl flex items-center justify-center text-muted-foreground p-6 text-center">
                <p>جاري البحث عن فرص...</p>
              </div>
            )}
          </div>

          {/* Education & News */}
          <div className="col-span-2 md:col-span-1 space-y-4">

            {/* Education Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/education/articles" className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                <BookOpen className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">المقالات</span>
              </Link>
              <Link href="/education/videos" className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group">
                <PlayCircle className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">فيديو</span>
              </Link>
            </div>

            {/* Latest News */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm">آخر الأخبار</h3>
                <Link href="/news" className="text-xs text-primary hover:underline">عرض الكل</Link>
              </div>
              <div className="space-y-3">
                {visibleNews.length > 0 ? (
                  visibleNews.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="mt-1 min-w-[4px] h-[4px] rounded-full bg-cyan-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-200 line-clamp-2 leading-relaxed">{item.title}</p>
                          {/* @ts-ignore */}
                          {item.isLocked && <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1 rounded">VIP</span>}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          {formatTime(item.publishedAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-muted-foreground">لا توجد أخبار حديثة</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
