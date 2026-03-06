import { prisma } from "@/lib/prisma";
import { handleSubscriptionRequest } from "@/app/actions/user";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
    // Aggressive error handling for the query
    let requests = [];
    try {
        requests = await prisma.subscriptionRequest.findMany({
            where: { status: 'PENDING' },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (err: any) {
        console.error("Prisma error in requests page:", err);
        return <div className="p-8 text-red-600 font-bold border-2 border-red-500 rounded-lg">
            خطأ في قاعدة البيانات: {err?.message || "مشكلة غير معروفة"}
        </div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">طلبات الاشتراك المعلقة</h2>

            {requests.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed rounded-lg bg-white">
                    لا توجد طلبات معلقة حالياً.
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const name = req.user?.name || "مستخدم غير معروف";
                        const email = req.user?.email || "بدون بريد";
                        const date = req.createdAt ? new Date(req.createdAt).toISOString().split('T')[0] : "---";

                        return (
                            <div key={req.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{name}</div>
                                    <div className="text-sm text-slate-500">{email}</div>
                                    <div className="text-xs text-slate-400 mt-1">تاريخ الطلب: {date}</div>
                                </div>

                                <div className="flex-1 flex items-center justify-center gap-4 border-x px-4">
                                    <div className={`text-sm font-bold px-3 py-1 rounded ${req.requestedTier === 'VIP' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                                        باقة: {req.requestedTier || "غير محددة"}
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        <div>المرسل: {req.senderName || "---"}</div>
                                        <div className="font-mono mt-1">رقم: {req.transferNumber || "---"}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <form action={handleSubscriptionRequest}>
                                        <input type="hidden" name="requestId" value={req.id} />
                                        <input type="hidden" name="userId" value={req.userId} />
                                        <input type="hidden" name="tier" value={req.requestedTier || ""} />
                                        <input type="hidden" name="action" value="approve" />
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white min-w-[70px]">
                                            قبول
                                        </Button>
                                    </form>
                                    <form action={handleSubscriptionRequest}>
                                        <input type="hidden" name="requestId" value={req.id} />
                                        <input type="hidden" name="action" value="reject" />
                                        <Button size="sm" variant="destructive" className="min-w-[70px]">
                                            رفض
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
