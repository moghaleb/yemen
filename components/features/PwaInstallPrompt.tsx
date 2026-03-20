"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(true);

    useEffect(() => {
        // Prevent showing prompt if already installed (standalone mode)
        const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        setIsStandalone(checkStandalone);
        
        if (checkStandalone) return;

        // Has the user dismissed the banner recently?
        const hasDismissed = localStorage.getItem("pwa_install_dismissed");
        const dismissedTime = hasDismissed ? parseInt(hasDismissed, 10) : 0;
        const now = new Date().getTime();
        
        // Show again after 7 days if dismissed
        if (hasDismissed && (now - dismissedTime < 7 * 24 * 60 * 60 * 1000)) {
            return;
        }

        // Detect iOS (Safari doesn't support beforeinstallprompt)
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        if (isIosDevice) {
            // Delay iOS prompt by 3 seconds for better UX
            const timer = setTimeout(() => setShowInstallBanner(true), 3000);
            return () => clearTimeout(timer);
        }

        // Handle Android/Chrome beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // Prevent native mini-infobar
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        // Show native prompt
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        }
        setDeferredPrompt(null);
        setShowInstallBanner(false);
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
        localStorage.setItem("pwa_install_dismissed", new Date().getTime().toString());
    };

    if (!showInstallBanner || isStandalone) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-[#111] border border-[#D4AF37]/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl p-4 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/10 blur-2xl rounded-full" />
                
                <button 
                    onClick={handleDismiss}
                    className="absolute top-2 left-2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 pr-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shrink-0 shadow-lg font-black text-black">
                        GR
                    </div>
                    
                    <div className="flex-1 pt-1">
                        <h3 className="font-bold text-white text-sm">تثبيت التطبيق</h3>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            أضف {`رادار الذهب`} للشاشة الرئيسية للوصول السريع والإشعارات الفورية!
                        </p>
                        
                        <div className="mt-3">
                            {isIOS ? (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-300 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full text-[10px]">1</span>
                                        <span>اضغط على زر المشاركة <Share className="w-3 h-3 inline mx-1" /></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full text-[10px]">2</span>
                                        <span>اختر "إضافة للشاشة الرئيسية" <PlusSquare className="w-3 h-3 inline mx-1" /></span>
                                    </div>
                                </div>
                            ) : (
                                <Button 
                                    onClick={handleInstallClick}
                                    className="w-full h-8 bg-[#D4AF37] hover:bg-[#b08d2b] text-black font-bold text-xs"
                                >
                                    تثبيت الآن
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
