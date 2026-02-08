"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { useState } from "react";
import NotificationPermission from "@/components/features/NotificationPermission";

interface HeaderProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

export default function Header({ user }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8a7018] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                        <span className="text-black font-bold text-lg">G</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] bg-[length:200%_auto] animate-shine">
                        Golden Radar
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                        <Search className="w-5 h-5" />
                    </Button>
                    <NotificationPermission />

                    {user ? (
                        <Link href="/account" className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-xs font-medium text-foreground">{user.name || "User"}</span>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-black font-bold">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="glow" size="sm" className="hidden md:flex">
                                تسجيل الدخول
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Link href="/account" className="md:hidden">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/50 overflow-hidden">
                            {user && user.image ? (
                                <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                            ) : user ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-[10px] text-black font-bold">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            ) : (
                                <User className="w-4 h-4 text-cyan-400" />
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
