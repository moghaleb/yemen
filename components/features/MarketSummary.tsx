import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MarketItemProps {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
}

const MarketItem = ({ label, value, change, trend }: MarketItemProps) => {
    return (
        <div className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="text-lg font-bold text-foreground">{value}</span>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
                {trend === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
                {change}
            </div>
        </div>
    );
};

export default function MarketSummary() {
    // Mock data - would be fetched from API in real implementation
    const marketData = [
        { label: "Gold (XAU/USD)", value: "$2,045.50", change: "+0.35%", trend: "up" as const },
        { label: "Silver (XAG/USD)", value: "$22.80", change: "-0.15%", trend: "down" as const },
        { label: "S&P 500", value: "4,780.20", change: "+0.10%", trend: "up" as const },
        { label: "Oil (WTI)", value: "$72.45", change: "0.00%", trend: "neutral" as const },
    ];

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-gradient-gold mb-4">ملخص السوق اليوم</h3>
            <div className="grid gap-2">
                {marketData.map((item, index) => (
                    <MarketItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
}
