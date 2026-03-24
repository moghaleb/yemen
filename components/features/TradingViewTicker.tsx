"use client";

import { useEffect, useRef } from "react";

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent duplicate scripts from being added in React strict mode
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "OANDA:XAUUSD",
          title: "الذهب (Gold)",
        },
        {
          proName: "OANDA:XAGUSD",
          title: "الفضة (Silver)",
        },
        {
          proName: "FX_IDC:EURUSD",
          title: "يورو/دولار",
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "بيتكوين",
        },
        {
          description: "النفط الخام",
          proName: "TVC:USOIL"
        }
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "regular",
      colorTheme: "dark",
      locale: "ar_AE",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full border-b border-white/10 bg-[#131722] z-40 relative">
        <div 
        className="tradingview-widget-container" 
        ref={containerRef}
        >
        <div className="tradingview-widget-container__widget"></div>
        </div>
    </div>
  );
}
