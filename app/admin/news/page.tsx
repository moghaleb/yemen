import { prisma } from "@/lib/prisma";
import { createNews, deleteNews } from "@/app/actions/admin";

export default async function ManageNews() {
    const news = await prisma.newsItem.findMany({
        orderBy: { publishedAt: "desc" },
    });

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">إدارة الأخبار</h2>

            {/* Create Form */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold border-b pb-2">نشر خبر جديد</h3>
                <form action={createNews} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">عنوان الخبر</label>
                        <input type="text" name="title" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" required placeholder="عنوان رئيسي جذاب" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">المصدر</label>
                            <input type="text" name="source" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" placeholder="مثلاً: Reuters, Bloomberg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التأثير المتوقع</label>
                            <select name="impact" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required>
                                <option value="HIGH">عالي (أحمر 🔴)</option>
                                <option value="MEDIUM">متوسط (برتقالي 🟠)</option>
                                <option value="LOW">منخفض (أخضر 🟢)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
                            <select name="category" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required>
                                <option value="GENERAL">عام</option>
                                <option value="GOLD">ذهب (لوحة الذهب)</option>
                                <option value="STOCK">أسهم</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">أقل باقة (للمشاهدة)</label>
                            <select name="minTier" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required>
                                <option value="FREE">مجاني (Free)</option>
                                <option value="BASIC">عادي (Basic)</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ملخص الخبر</label>
                        <textarea name="summary" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required placeholder="تفاصيل الخبر..."></textarea>
                    </div>
                    <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 font-medium shadow-sm transition-colors">
                        نشر الخبر
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {news.map((item) => (
                        <li key={item.id} className="flex justify-between p-4 hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-gray-900">{item.title}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.impact === 'HIGH' ? 'bg-red-100 text-red-800' :
                                            item.impact === 'MEDIUM' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {item.impact === 'HIGH' ? 'عالي' : item.impact === 'MEDIUM' ? 'متوسط' : 'منخفض'}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                        // @ts-ignore
                                        item.minTier === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                            // @ts-ignore
                                            item.minTier === 'BASIC' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {/* @ts-ignore */}
                                        {item.minTier === 'FREE' ? 'مجاني' : item.minTier}
                                    </span>
                                    {item.category === 'GOLD' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">ذهب</span>}
                                </div>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{item.source || "غير محدد"}</span>
                                </p>
                            </div>
                            <form action={deleteNews.bind(null, item.id)}>
                                <button className="text-red-600 hover:text-red-900 text-sm border border-red-200 hover:bg-red-50 rounded px-3 py-1 transition-colors">حذف</button>
                            </form>
                        </li>
                    ))}
                    {news.length === 0 && (
                        <li className="p-8 text-center text-gray-500">لا توجد أخبار منشورة.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
