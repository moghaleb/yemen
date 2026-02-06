import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { updateUserSubscription } from "@/app/actions/user";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">إدارة المستخدمين والاشتراكات</h2>

            <div className="rounded-lg border bg-white shadow">
                {/* Header */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-700">
                    <div>الاسم / البريد</div>
                    <div>نوع الاشتراك</div>
                    <div>تاريخ الانتهاء</div>
                    <div>إجراءات</div>
                </div>

                {/* Body */}
                <div className="divide-y">
                    {users.map((user) => (
                        <form key={user.id} action={updateUserSubscription} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                            <input type="hidden" name="userId" value={user.id} />

                            {/* User Info */}
                            <div className="overflow-hidden">
                                <div className="font-medium text-gray-900 truncate">{user.name || "بدون اسم"}</div>
                                <div className="text-xs text-gray-500 truncate" title={user.email}>{user.email}</div>
                            </div>

                            {/* Subscription Tier */}
                            <div>
                                <select
                                    name="tier"
                                    defaultValue={user.subscriptionTier || 'FREE'}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                >
                                    <option value="FREE">مجاني</option>
                                    <option value="BASIC">عادي ($30)</option>
                                    <option value="VIP">VIP ($100)</option>
                                </select>
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    defaultValue={user.subscriptionExpiry ? format(user.subscriptionExpiry, "yyyy-MM-dd") : ""}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                />
                            </div>

                            {/* Actions */}
                            <div>
                                <Button size="sm" type="submit" className="w-full md:w-auto">حفظ التغييرات</Button>
                            </div>
                        </form>
                    ))}
                </div>

                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        لا يوجد مستخدمين مسجلين بعد.
                    </div>
                )}
            </div>
        </div>
    );
}
