import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { auth } from "@/auth";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: "Financial Market Insights",
  description: "Your daily source for market summaries, gold & stock recommendations, and financial education.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cn(tajawal.className, "min-h-screen bg-background font-sans antialiased")}>
        <Header user={session?.user} />
        <main className="relative flex min-h-screen flex-col pb-16 pt-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
