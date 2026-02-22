import { prisma } from "@/lib/prisma";
import { createBreakingNews, deleteBreakingNews } from "@/app/actions/admin";

export default async function ManageTicker() {
    const tickerItems = await prisma.breakingNews.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">إدارة شريط الأخبار العاجلة</h2>

            {/* Create Form */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold border-b pb-2">إضافة خبر عاجل للشريط</h3>
                <form action={createBreakingNews} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">نص الخبر</label>
                        <input type="text" name="content" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-red-500 focus:ring-red-500" required placeholder="مثال: ارتفاع مفاجئ في الذهب بسبب التوترات..." />
                        <p className="text-xs text-gray-400 mt-1">سيظهر هذا النص في الشريط المتحرك أعلى الموقع.</p>
                    </div>
                    <button type="submit" className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700 font-medium shadow-sm transition-colors">
                        نشر في الشريط
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-700">الأخبار النشطة حالياً</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {tickerItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <div>
                                    <p className="font-bold text-gray-900">{item.content}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(item.createdAt).toLocaleString('ar-EG')}
                                    </p>
                                </div>
                            </div>
                            <form action={deleteBreakingNews.bind(null, item.id)}>
                                <button className="text-red-600 hover:text-red-900 text-sm border border-red-200 hover:bg-red-50 rounded px-3 py-1 transition-colors">حذف</button>
                            </form>
                        </li>
                    ))}
                    {tickerItems.length === 0 && (
                        <li className="p-8 text-center text-gray-500">لا توجد أخبار في الشريط حالياً. سيتم عرض آخر الأخبار العامة تلقائياً.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
