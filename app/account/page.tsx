import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, CreditCard, Settings, Crown } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function AccountPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Fetch fresh user data including subscription status
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            image: true,
            subscriptionTier: true,
            subscriptionExpiry: true,
            role: true
        }
    });

    if (!user) {
        redirect("/login"); // Fallback if user deleted
    }

    const isVip = user.subscriptionTier === 'VIP' || user.subscriptionTier === 'GOLD' || user.role === 'ADMIN';

    return (
        <div className="flex flex-col min-h-screen pb-20">
            <header className="sticky top-0 z-10 glass border-b border-white/10 p-4">
                <h1 className="text-xl font-bold text-center text-gradient-gold">حسابي</h1>
            </header>

            <main className="container flex-1 py-6 px-4 space-y-6">

                {/* Profile Header */}
                <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground">{user.name || "مستخدم"}</h2>
                        <p className="text-sm text-muted-foreground dir-ltr text-right">{user.email}</p>
                        <div className="mt-2 flex gap-2">
                            {isVip ? (
                                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/50 hover:bg-amber-500/30">
                                    <Crown className="w-3 h-3 ml-1" /> عضو VIP
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300">عضوية مجانية</Badge>
                            )}

                            {user.role === 'ADMIN' && (
                                <Link href="/admin">
                                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-500 hover:bg-cyan-500/10 cursor-pointer">
                                        لوحة التحكم
                                    </Badge>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subscription Card */}
                <div className={`glass-card rounded-2xl p-6 ${isVip ? 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">خطة الاشتراك</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isVip ? "أنت تستمتع بكافة المزايا الحصرية" : "رقي حسابك للحصول على توصيات حصرية"}
                            </p>
                        </div>
                        {isVip && <Crown className="w-6 h-6 text-amber-500" />}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/5">
                            <span className="text-muted-foreground">الخطة الحالية:</span>
                            <span className={`font-bold ${isVip ? 'text-amber-400' : 'text-slate-400'}`}>
                                {isVip ? 'VIP Premium' : 'مجاني (Basic)'}
                            </span>
                        </div>

                        {!isVip && (
                            <Button
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold shadow-lg shadow-amber-500/20 border-0"
                            >
                                <Crown className="w-4 h-4 ml-2" /> ترقية إلى VIP
                            </Button>
                        )}

                        {user.subscriptionExpiry && (
                            <div className="text-xs text-center text-muted-foreground">
                                يتجدد في {new Date(user.subscriptionExpiry).toLocaleDateString('ar-EG')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                    {[
                        { label: "المعلومات الشخصية", icon: User },
                        { label: "طرق الدفع", icon: CreditCard },
                        { label: "الإعدادات", icon: Settings },
                    ].map((item, i) => (
                        <Button key={i} variant="glass" className="w-full justify-start h-14 text-base font-normal text-foreground group">
                            <item.icon className="w-5 h-5 ml-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            {item.label}
                        </Button>
                    ))}

                    <SignOutButton />
                </div>

            </main>
        </div>
    );
}
