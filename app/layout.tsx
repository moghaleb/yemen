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
  title: "رادار الذهب | Golden Radar",
  description: "منصة احترافية لتحليل وتوصيات وأخبار الذهب والفضة مع إشارات لحظية تساعدك على اتخاذ قرارات تداول أدق. عينك الذكية على الذهب.",
  keywords: "ذهب, فضة, تداول, توصيات, تحليل فني, أخبار السوق, استثمار",
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
