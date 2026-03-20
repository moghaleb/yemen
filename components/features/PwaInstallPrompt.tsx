"use client";

import { useState, useEffect } from "react";
import { Share, PlusSquare } from "lucide-react";
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
            // Delay iOS prompt by 2 seconds for better UX
            const timer = setTimeout(() => setShowInstallBanner(true), 2000);
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
        if (!deferredPrompt) {
            // If iOS, maybe show instructions or do nothing for the button 
            // the button should trigger native browser dialog if it exists
            return;
        }
        
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
        <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-5 duration-500">
            {/* The white card container matching the image */}
            <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-5 pb-8 relative w-full max-w-md mx-auto" dir="rtl">
                
                <div className="flex items-center justify-between mb-6">
                    {/* Text Section (Right side in RTL) */}
                    <div className="flex-1 pl-4">
                        <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1">
                            حمّل تطبيق رادار الذهب
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            للحصول على وصول سريع للتوصيات وتجربة أفضل!
                        </p>
                    </div>

                    {/* Logo Section (Left side in RTL) */}
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative">
                        {/* We use a placeholder text if no image, but try to use logo.png if it exists */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] opacity-10" />
                        <span className="text-[#D4AF37] font-black text-xl z-10">GR</span>
                        {/* 
                          To use your actual logo:
                          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-2 relative z-10" />
                        */}
                    </div>
                </div>

                {isIOS ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600 flex flex-col gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full text-xs font-bold text-gray-800">1</span>
                            <span>اضغط على زر المشاركة <Share className="w-4 h-4 inline mx-1 text-gray-400" /> أسفل المتصفح</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full text-xs font-bold text-gray-800">2</span>
                            <span>اختر "إضافة للشاشة الرئيسية" <PlusSquare className="w-4 h-4 inline mx-1 text-gray-400" /></span>
                        </div>
                        <div className="flex gap-3 mt-2">
                             <Button 
                                onClick={handleDismiss}
                                variant="outline"
                                className="flex-1 h-12 bg-gray-100 border-0 hover:bg-gray-200 text-gray-600 font-bold text-base rounded-xl"
                            >
                                إغلاق
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleInstallClick}
                            className="flex-1 h-12 bg-[#D4AF37] hover:bg-[#b08d2b] text-white font-bold text-base rounded-xl border-0 shadow-lg shadow-[#D4AF37]/30"
                        >
                            تثبيت التطبيق
                        </Button>
                        <Button 
                            onClick={handleDismiss}
                            variant="outline"
                            className="flex-1 h-12 bg-gray-100 border-0 hover:bg-gray-200 text-gray-600 font-bold text-base rounded-xl"
                        >
                            لاحقاً
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
