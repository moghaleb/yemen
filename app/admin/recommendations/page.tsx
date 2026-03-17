import { prisma } from "@/lib/prisma";
import { createRecommendation, deleteRecommendation } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";

export default async function ManageRecommendations() {
    const recommendations = await prisma.recommendation.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">إدارة التوصيات</h2>

            {/* Create Form */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold border-b pb-2">إضافة توصية جديدة</h3>
                <form action={createRecommendation} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الأصل (Type)</label>
                            <select name="type" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" required>
                                <option value="GOLD">ذهب (XAU/USD)</option>
                                <option value="STOCK">أسهم (Stocks)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الإجراء (Signal)</label>
                            <select name="action" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" required>
                                <option value="BUY">شراء (BUY)</option>
                                <option value="SELL">بيع (SELL)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">أقل باقة مطلوبة</label>
                            <select name="minTier" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" required>
                                <option value="FREE">مجاني (Free)</option>
                                <option value="BASIC">عادي (Basic)</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">سعر الدخول</label>
                            <input type="number" step="0.01" name="price" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required placeholder="مثلاً: 2030.50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">وقف الخسارة (Stop Loss)</label>
                            <input type="number" step="0.01" name="stopLoss" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" placeholder="اختياري" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">جني الأرباح (Take Profit)</label>
                            <input type="number" step="0.01" name="takeProfit" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" placeholder="اختياري" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">السبب / التحليل</label>
                        <textarea name="rationale" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm" required placeholder="لماذا نوصي بهذا؟"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">صورة التوصية (اختياري)</label>
                        <input type="file" name="imageFile" accept="image/*" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
                    </div>
                    <button type="submit" className="rounded-md bg-amber-600 px-6 py-2 text-white hover:bg-amber-700 font-medium shadow-sm transition-colors">
                        نشر التوصية
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="rounded-lg bg-white shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">النوع</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">الإشارة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">السعر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">الباقة</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">الحالة</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {recommendations.map((rec) => (
                            <tr key={rec.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    {rec.type === 'GOLD' ? 'ذهب 🟡' : 'أسهم 📈'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={rec.action === "BUY" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                        {rec.action === "BUY" ? "شراء 🟢" : "بيع 🔴"}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-mono">{rec.price}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${rec.minTier === 'VIP' ? 'bg-amber-100 text-amber-800' :
                                        rec.minTier === 'BASIC' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {rec.minTier === 'FREE' ? 'مجاني' : rec.minTier}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Badge variant={rec.status === "ACTIVE" ? "default" : "secondary"}>
                                        {rec.status === "ACTIVE" ? "نشط" : "منتهي"}
                                    </Badge>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-left">
                                    <form action={deleteRecommendation.bind(null, rec.id)}>
                                        <button className="text-red-600 hover:text-red-900 border border-red-200 hover:bg-red-50 rounded px-3 py-1 text-sm transition-colors">حذف</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {recommendations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        لا توجد توصيات حالياً.
                    </div>
                )}
            </div>
        </div>
    );
}
