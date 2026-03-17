import { prisma } from "@/lib/prisma";
import { createEducationalContent, deleteEducationalContent } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function ManageEducation() {
    const content = await prisma.educationalContent.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">إدارة التعليم والتحليل</h2>

            {/* Create Form */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold border-b pb-2">إضافة محتوى جديد</h3>
                <form action={createEducationalContent} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                        <input type="text" name="title" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" required placeholder="عنوان المقال أو الفيديو" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">النوع</label>
                            <select name="type" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required>
                                <option value="ARTICLE">مقال (Article)</option>
                                <option value="VIDEO">فيديو (Video)</option>
                                <option value="ANALYSIS">تحليل فني (Analysis)</option>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">رابط (اختياري - للفيديو أو المصادر)</label>
                        <input type="text" name="url" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" placeholder="https://..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ملخص قصير</label>
                        <textarea name="summary" rows={2} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required placeholder="يظهر في صفحة القائمة..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">المحتوى الكامل (للمقالات والتحليل)</label>
                        <textarea name="content" rows={8} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" placeholder="اكتب المحتوى الكامل هنا..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">صورة المقال/التحليل (اختياري)</label>
                        <input type="file" name="imageFile" accept="image/*" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <input type="checkbox" name="isPremium" id="isPremium" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="isPremium" className="text-sm font-medium text-slate-700 select-none cursor-pointer">محتوى مدفوع (VIP/Basic فقط) 🔒</label>
                    </div>

                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                        نشر المحتوى
                    </Button>
                </form>
            </div>

            {/* List */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {content.map((item) => (
                        <li key={item.id} className="flex justify-between p-4 items-center hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.type === 'ANALYSIS' ? 'bg-purple-100 text-purple-800' :
                                        item.type === 'VIDEO' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {item.type === 'ANALYSIS' ? 'تحليل' : item.type === 'VIDEO' ? 'فيديو' : 'مقال'}
                                    </span>
                                    {item.category === 'GOLD' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">ذهب</span>}
                                    {item.isPremium && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">Premium 🔒</span>}
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                            </div>
                            <form action={deleteEducationalContent.bind(null, item.id)}>
                                <Button variant="destructive" size="sm" className="h-8">حذف</Button>
                            </form>
                        </li>
                    ))}
                    {content.length === 0 && (
                        <li className="p-8 text-center text-gray-500">لا يوجد محتوى تعليمي مضاف.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
