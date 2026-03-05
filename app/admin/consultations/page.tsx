import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Check, X, Clock, Calendar, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminConsultationsPage() {
    const consultations = await prisma.consultationRequest.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    async function handleStatusUpdate(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const status = formData.get('status') as string;

        await prisma.consultationRequest.update({
            where: { id },
            data: { status }
        });

        revalidatePath('/admin/consultations');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">إدارة طلبات الاستشارة</h2>
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    إجمالي الطلبات: {consultations.length}
                </div>
            </div>

            {consultations.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center border border-dashed text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>لا توجد طلبات استشارة بعد.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {consultations.map((con) => (
                        <div key={con.id} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                        {con.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{con.user?.name || "مستخدم غير محدد"}</div>
                                        <div className="text-sm text-slate-500">{con.user?.email || "غير متوفر"}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${con.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                        con.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                        {con.status === 'PENDING' ? 'قيد الانتظار' :
                                            con.status === 'COMPLETED' ? 'مكتمل' : 'ملغي'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> موضوع الاستشارة
                                    </div>
                                    <p className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {con.topic}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> الموعد المفضل
                                    </div>
                                    <p className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {con.preferredDate || "غير محدد"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t text-sm">
                                <div className="text-slate-400">
                                    تاريخ الطلب: {new Date(con.createdAt).toLocaleString('ar-EG')}
                                </div>
                                <div className="flex gap-2">
                                    {con.status === 'PENDING' && (
                                        <>
                                            <form action={handleStatusUpdate}>
                                                <input type="hidden" name="id" value={con.id} />
                                                <input type="hidden" name="status" value="COMPLETED" />
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1">
                                                    <Check className="w-3 h-3" /> تم التواصل
                                                </Button>
                                            </form>
                                            <form action={handleStatusUpdate}>
                                                <input type="hidden" name="id" value={con.id} />
                                                <input type="hidden" name="status" value="CANCELLED" />
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1">
                                                    <X className="w-3 h-3" /> إلغاء
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
