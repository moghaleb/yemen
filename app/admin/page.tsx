import { prisma } from "@/lib/prisma";
import { Users, Newspaper, TrendingUp, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch counts
    const activeRecsCount = await prisma.recommendation.count({
        where: { status: 'ACTIVE' }
    });

    const newsCount = await prisma.newsItem.count();

    const usersCount = await prisma.user.count({
        where: { role: { not: 'ADMIN' } }
    });

    const pendingRequestsCount = await prisma.subscriptionRequest.count({
        where: { status: 'PENDING' }
    });

    return (
        <div>
            <h2 className="mb-6 text-3xl font-bold">نظرة عامة</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow-md border-r-4 border-amber-500 flex items-center justify-between">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-600">التوصيات النشطة</h3>
                        <p className="text-4xl font-bold text-amber-600">{activeRecsCount}</p>
                        <p className="text-sm text-slate-400">توصية جارية</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-amber-200" />
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md border-r-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-600">الأخبار</h3>
                        <p className="text-4xl font-bold text-blue-600">{newsCount}</p>
                        <p className="text-sm text-slate-400">خبر منشور</p>
                    </div>
                    <Newspaper className="w-10 h-10 text-blue-200" />
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md border-r-4 border-green-500 flex items-center justify-between">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-600">المستخدمين</h3>
                        <p className="text-4xl font-bold text-green-600">{usersCount}</p>
                        <p className="text-sm text-slate-400">مشترك مسجل</p>
                    </div>
                    <Users className="w-10 h-10 text-green-200" />
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md border-r-4 border-purple-500 flex items-center justify-between">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-slate-600">طلبات الاشتراك</h3>
                        <p className="text-4xl font-bold text-purple-600">{pendingRequestsCount}</p>
                        <p className="text-sm text-slate-400">طلب قيد الانتظار</p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-purple-200" />
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-indigo-50 p-6 border border-indigo-100">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">روابط سريعة</h3>
                <div className="flex flex-wrap gap-4">
                    <a href="/admin/recommendations" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-medium">إدارة التوصيات</a>
                    <a href="/admin/news" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">نشر أخبار</a>
                    <a href="/admin/requests" className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 font-medium">
                        طلبات الاشتراك
                        {pendingRequestsCount > 0 && (
                            <span className="bg-white text-amber-600 text-xs font-bold px-2 py-0.5 rounded-full mr-2">{pendingRequestsCount}</span>
                        )}
                    </a>
                    <a href="/admin/users" className="bg-slate-700 text-white px-6 py-2 rounded hover:bg-slate-800 font-medium">إدارة المستخدمين</a>
                </div>
            </div>
        </div>
    );
}
