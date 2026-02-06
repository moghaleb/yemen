"use client";

import { useRef, useEffect } from "react";

interface NewsItem {
    id: string;
    text: string;
    time: string;
}

export default function NewsTicker() {
    const newsItems: NewsItem[] = [
        { id: "1", text: "Gold breaks above $2050 resistance level", time: "10m ago" },
        { id: "2", text: "Federal Reserve signals potential rate cuts", time: "30m ago" },
        { id: "3", text: "Oil prices stabilize amidst supply concerns", time: "1h ago" },
    ];

    return (
        <div className="w-full overflow-hidden py-2 bg-transparent">
            <div className="container flex items-center">
                <div className="bg-red-600/20 border border-red-500/50 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full mr-3 whitespace-nowrap animate-pulse">
                    عاجل
                </div>
                <div className="flex-1 overflow-hidden relative h-6">
                    <div className="animate-marquee whitespace-nowrap absolute top-0 left-0 flex items-center gap-8">
                        {[...newsItems, ...newsItems].map((item, i) => (
                            <span key={`${item.id}-${i}`} className="text-sm font-medium inline-flex items-center">
                                {item.text}
                                <span className="text-xs opacity-70 ml-2">({item.time})</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
