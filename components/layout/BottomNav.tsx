"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Newspaper, GraduationCap, Calendar } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "الرئيسية", href: "/", icon: Home },
        { label: "التوصيات", href: "/recommendations", icon: LineChart },
        { label: "الأخبار", href: "/news", icon: Newspaper },
        { label: "التعليم", href: "/education/articles", icon: GraduationCap },
        { label: "استشارة", href: "/booking", icon: Calendar },
    ];

    return (
        <nav className="fixed bottom-0 w-full glass border-t border-white/5 bg-black/40 backdrop-blur-xl z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="container flex justify-around items-center pt-2 pb-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                 ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary/50"}
               `}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
