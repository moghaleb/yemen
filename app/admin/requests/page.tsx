import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
    const requests = await prisma.subscriptionRequest.findMany({
        where: { status: 'PENDING' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    async function handleRequest(formData: FormData) {
        'use server';
        const requestId = formData.get('requestId') as string;
        const action = formData.get('action') as string; // 'approve' or 'reject'
        const userId = formData.get('userId') as string;
        const tier = formData.get('tier') as string;

        if (action === 'approve') {
            await prisma.$transaction([
                // Update User Tier
                prisma.user.update({
                    where: { id: userId },
                    data: { subscriptionTier: tier }
                }),
                // Update Request Status
                prisma.subscriptionRequest.update({
                    where: { id: requestId },
                    data: { status: 'APPROVED' }
                })
            ]);
        } else {
            // Reject
            await prisma.subscriptionRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
        }

        revalidatePath('/admin/requests');
    }

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
                                <th className="p-4 font-medium text-slate-500">المستخدم</th>
                                <th className="p-4 font-medium text-slate-500">الباقة المطلوبة</th>
                                <th className="p-4 font-medium text-slate-500">تاريخ الطلب</th>
                                <th className="p-4 font-medium text-slate-500">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {req.user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <div className="font-bold">{req.user.name}</div>
                                                <div className="text-xs text-slate-500">{req.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.requestedTier === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {req.requestedTier}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {new Date(req.createdAt).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <form action={handleRequest}>
                                                <input type="hidden" name="requestId" value={req.id} />
                                                <input type="hidden" name="userId" value={req.userId} />
                                                <input type="hidden" name="tier" value={req.requestedTier} />
                                                <input type="hidden" name="action" value="approve" />
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                                    <Check className="w-4 h-4" /> قبول
                                                </Button>
                                            </form>
                                            <form action={handleRequest}>
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
