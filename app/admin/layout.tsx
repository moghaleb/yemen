import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// In a real app, fetch the user from session
async function getUser() {
    const session = await auth();
    return session?.user;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/admin-login");
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
                        href="/admin/consultations"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        الاستشارات
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
                        href="/admin/articles"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        المقالات
                    </Link>
                    <Link
                        href="/admin/education"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        التعليم
                    </Link>
                    <Link
                        href="/admin/ticker"
                        className="block rounded px-4 py-2 hover:bg-slate-800"
                    >
                        شريط الأخبار
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
