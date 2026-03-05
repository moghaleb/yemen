import { prisma } from "@/lib/prisma";
import { handleSubscriptionRequest } from "@/app/actions/user";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
    const requests = await prisma.subscriptionRequest.findMany({
        where: { status: 'PENDING' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">طلبات الاشتراك المعلقة</h2>

            {requests.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center border border-dashed text-slate-500">
                    <Check className="w-12 h-12 mx-auto mb-4 text-green-200" />
                    <p>لا توجد طلبات معلقة حالياً. كل شيء تحت السيطرة!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-medium text-slate-500 text-right">المستخدم</th>
                                <th className="p-4 font-medium text-slate-500 text-right">الباقة المطلوبة</th>
                                <th className="p-4 font-medium text-slate-500 text-right">اسم المرسل</th>
                                <th className="p-4 font-medium text-slate-500 text-right">رقم الحوالة</th>
                                <th className="p-4 font-medium text-slate-500 text-right">تاريخ الطلب</th>
                                <th className="p-4 font-medium text-slate-500 text-right">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {req.user?.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="font-bold">{req.user?.name || "مستخدم غير معروف"}</div>
                                                <div className="text-xs text-slate-500">{req.user?.email || "البريد غير متوفر"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.requestedTier === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {req.requestedTier}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-medium">
                                        {req.senderName || <span className="text-slate-300 italic">غير متوفر</span>}
                                    </td>
                                    <td className="p-4 text-sm font-mono text-slate-500">
                                        {req.transferNumber || <span className="text-slate-300 italic">---</span>}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <form action={handleSubscriptionRequest}>
                                                <input type="hidden" name="requestId" value={req.id} />
                                                <input type="hidden" name="userId" value={req.userId} />
                                                <input type="hidden" name="tier" value={req.requestedTier} />
                                                <input type="hidden" name="action" value="approve" />
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                                    <Check className="w-4 h-4" /> قبول
                                                </Button>
                                            </form>
                                            <form action={handleSubscriptionRequest}>
                                                <input type="hidden" name="requestId" value={req.id} />
                                                <input type="hidden" name="action" value="reject" />
                                                <Button size="sm" variant="destructive" className="gap-2">
                                                    <X className="w-4 h-4" /> رفض
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
