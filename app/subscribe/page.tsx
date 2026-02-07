import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react"; // Import icons
import SubscribeButton from "@/components/features/SubscribeButton";
import Link from "next/link"; // For "Contact Us" or similar if needed

export default async function SubscribePage() {
    const session = await auth();
    const user = session?.user?.email ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { requests: { where: { status: 'PENDING' } } }
    }) : null;

    const currentTier = user?.subscriptionTier || 'FREE';
    const pendingRequest = user?.requests?.[0];

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">اختر خطة الاشتراك المناسبة لك</h1>
                    <p className="text-gray-600">احصل على توصيات حصرية وفرص استثمارية مميزة مع باقاتنا المتنوعة.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col">
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">مجاني</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-500">/ شهرياً</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-gray-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>أخبار السوق اليومية</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>توصيات عامة محدودة</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>محتوى تعليمي أساسي</span>
                            </li>
                        </ul>
                        <Button variant="outline" disabled className="w-full">
                            {currentTier === 'FREE' ? 'بانتظارك حالياً' : 'متاح'}
                        </Button>
                    </div>

                    {/* Basic Plan */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">شائع</div>
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">الأساسية (Basic)</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$30</span>
                                <span className="text-gray-500">/ شهرياً</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-gray-600">
                                <Zap className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>جميع ميزات المجاني</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>توصيات أسهم وذهب يومية</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-600">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>تحليلات فنية</span>
                            </li>
                        </ul>

                        {currentTier === 'BASIC' ? (
                            <Button className="w-full bg-green-100 text-green-700 hover:bg-green-200" disabled>
                                باقتك الحالية ✅
                            </Button>
                        ) : (
                            <SubscribeButton
                                tier="BASIC"
                                pendingRequest={user?.requests?.[0]}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                طلب الاشتراك
                            </SubscribeButton>
                        )}
                    </div>

                    {/* VIP Plan */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 flex flex-col text-white">
                        {/* ... existing VIP header content ... */}
                        <div className="mb-4">
                            <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">VIP</span>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$100</span>
                                <span className="text-gray-400">/ شهرياً</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Star className="w-5 h-5 text-amber-400 shrink-0" />
                                <span>جميع ميزات Basic</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Check className="w-5 h-5 text-green-400 shrink-0" />
                                <span>توصيات خاصة وعالية الدقة</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Check className="w-5 h-5 text-green-400 shrink-0" />
                                <span>دعم مباشر واستشارات</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Check className="w-5 h-5 text-green-400 shrink-0" />
                                <span>تنبيهات فورية</span>
                            </li>
                        </ul>
                        {currentTier === 'VIP' ? (
                            <Button className="w-full bg-amber-100 text-amber-700 hover:bg-amber-200" disabled>
                                باقتك الحالية 👑
                            </Button>
                        ) : (
                            <SubscribeButton
                                tier="VIP"
                                pendingRequest={user?.requests?.[0]}
                                variant="secondary"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none"
                            >
                                طلب اشتراك VIP
                            </SubscribeButton>
                        )}
                    </div>
                </div>

                {pendingRequest && (
                    <div className="mt-8 max-w-md mx-auto bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                        <p className="text-yellow-800 text-sm">
                            لديك طلب معلق للاشتراك في باقة <strong>{pendingRequest.requestedTier}</strong>. يرجى انتظار موافقة الإدارة.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
