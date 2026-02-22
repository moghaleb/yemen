import { prisma } from "@/lib/prisma";
import { createEducationalContent, deleteEducationalContent } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function ManageArticles() {
    // Filter for ARTICLE type only
    const articles = await prisma.educationalContent.findMany({
        where: { type: "ARTICLE" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">إدارة المقالات</h2>

            {/* Create Form */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold border-b pb-2">نشر مقال جديد</h3>
                {/* We use the same action but inject type='ARTICLE' via hidden input or wrapper */}
                <form action={createEducationalContent} className="space-y-4">
                    <input type="hidden" name="type" value="ARTICLE" />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">عنوان المقال</label>
                        <input type="text" name="title" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" required placeholder="عنوان جذاب للمقال" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
                            <select name="category" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required>
                                <option value="GENERAL">عام</option>
                                <option value="GOLD">ذهب (سوق الذهب)</option>
                                <option value="STOCK">أسهم</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رابط المصدر (اختياري)</label>
                            <input type="text" name="url" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" placeholder="https://..." />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">نص المقال / الملخص</label>
                        <textarea name="summary" rows={6} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required placeholder="اكتب محتوى المقال هنا..."></textarea>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <input type="checkbox" name="isPremium" id="isPremium" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="isPremium" className="text-sm font-medium text-slate-700 select-none cursor-pointer">محتوى مدفوع (للمشتركين فقط) 🔒</label>
                    </div>

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                        نشر المقال
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-700">المقالات المنشورة</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {articles.map((item) => (
                        <li key={item.id} className="flex justify-between p-4 items-center hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">مقال</span>
                                    {item.category === 'GOLD' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">ذهب</span>}
                                    {item.isPremium && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">Premium 🔒</span>}
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <form action={deleteEducationalContent.bind(null, item.id)}>
                                <Button variant="destructive" size="sm" className="h-8">حذف</Button>
                            </form>
                        </li>
                    ))}
                    {articles.length === 0 && (
                        <li className="p-8 text-center text-gray-500">لا توجد مقالات مضافة بعد.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
