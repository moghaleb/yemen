"use client";

import { useEffect, useState } from "react";

interface NewsItem {
    id: string;
    title: string;
    publishedAt: Date;
    category: string;
    source?: string | null;
}

interface TickerItem {
    id: string;
    content: string;
    createdAt: Date;
}

interface NewsTickerProps {
    initialNews?: NewsItem[]; // Keep for backward compatibility or if used elsewhere
    tickerItems?: TickerItem[];
}

export default function NewsTicker({ initialNews = [], tickerItems = [] }: NewsTickerProps) {
    // Determine badge color based on category
    const getBadgeColor = (category: string) => {
        switch (category) {
            case 'GOLD': return 'text-[#D4AF37] border-[#D4AF37]/50 bg-[#D4AF37]/10';
            case 'STOCK': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
            default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'GOLD': return 'ذهب';
            case 'STOCK': return 'أسهم';
            default: return 'عام';
        }
    };

    // Format time relative
    const formatTime = (date: Date) => {
        try {
            const now = new Date();
            const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / 60000);

            if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
            if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
            return new Date(date).toLocaleDateString('ar-EG');
        } catch (e) {
            return "";
        }
    };

    if ((!initialNews || initialNews.length === 0) && (!tickerItems || tickerItems.length === 0)) return null;

    const itemsToDisplay = tickerItems.length > 0 ? tickerItems : initialNews;

    return (
        <div className="w-full overflow-hidden py-2 bg-transparent">
            <div className="container flex items-center">
                <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full mr-3 whitespace-nowrap animate-pulse">
                    عاجل
                </div>
                <div className="flex-1 overflow-hidden relative h-6">
                    <style jsx global>{`
                        @keyframes marquee-scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                    `}</style>
                    <div
                        className="absolute top-0 right-0 flex items-center"
                        dir="ltr"
                        style={{
                            width: 'max-content',
                            animation: 'marquee-scroll 30s linear infinite'
                        }}
                    >
                        {/* First Copy */}
                        <div className="flex items-center gap-8 px-4">
                            {itemsToDisplay.map((item, i) => {
                                const isTicker = 'content' in item;
                                const text = isTicker ? (item as TickerItem).content : (item as NewsItem).title;
                                const category = isTicker ? 'URGENT' : (item as NewsItem).category;

                                return (
                                    <span key={`original-${item.id}-${i}`} className="text-sm font-medium inline-flex items-center whitespace-nowrap">
                                        {!isTicker && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ml-2 ${getBadgeColor(category)}`}>
                                                {getCategoryLabel(category)}
                                            </span>
                                        )}
                                        {text}
                                        <span className="mx-6 text-xs text-amber-500 font-bold animate-pulse">• عاجل •</span>
                                    </span>
                                );
                            })}
                        </div>

                        {/* Duplicate Copy for Seamless Loop */}
                        <div className="flex items-center px-4">
                            {itemsToDisplay.map((item, i) => {
                                const isTicker = 'content' in item;
                                const text = isTicker ? (item as TickerItem).content : (item as NewsItem).title;
                                const category = isTicker ? 'URGENT' : (item as NewsItem).category;

                                return (
                                    <span key={`dup-${item.id}-${i}`} className="text-sm font-medium inline-flex items-center whitespace-nowrap">
                                        {!isTicker && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ml-2 ${getBadgeColor(category)}`}>
                                                {getCategoryLabel(category)}
                                            </span>
                                        )}
                                        {text}
                                        <span className="mx-6 text-xs text-amber-500 font-bold animate-pulse">• عاجل •</span>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
