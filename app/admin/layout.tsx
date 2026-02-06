import Link from "next/link";
import { redirect } from "next/navigation";

// In a real app, fetch the user from session
async function getUser() {
    // MOCK: Retrieving role from nowhere for now, 
    // real implementation needs session/cookie parsing
    return { role: "ADMIN" };
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (user?.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full bg-slate-900 text-white md:w-64">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-amber-500">لوحة التحكم</h1>
                </div>
                <nav className="space-y-2 px-4">
                    <Link
                        href="/admin"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        الرئيسية
                    </Link>
                    <Link
                        href="/admin/users"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        المستخدمين
                    </Link>
                    <Link
                        href="/admin/requests"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        الطلبات
                    </Link>
                    <Link
                        href="/admin/recommendations"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        التوصيات
                    </Link>
                    <Link
                        href="/admin/news"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        الأخبار
                    </Link>
                    <Link
                        href="/admin/education"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        التعليم
                    </Link>
                    <Link
                        href="/"
                        className="block rounded px-4 py-2 text-slate-400 hover:bg-slate-800 mt-4"
                    >
                        العودة للموقع &rarr;
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 bg-slate-50 p-8 text-slate-900">
                {children}
            </main>
        </div>
    );
}
