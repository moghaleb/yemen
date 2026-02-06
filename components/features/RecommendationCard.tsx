import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface RecommendationCardProps {
    asset: string;
    type: "BUY" | "SELL" | "HOLD";
    price: string;
    target: string;
    stopLoss: string;
    rationale: string;
    risk: "Low" | "Medium" | "High";
    date: string;
    isLocked?: boolean;
}

export default function RecommendationCard({
    asset,
    type,
    price,
    target,
    stopLoss,
    rationale,
    risk,
    date,
    onShare,
    isLocked = false,
}: RecommendationCardProps) {

    const typeColor =
        type === "BUY" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
            type === "SELL" ? "bg-red-100 text-red-800 border-red-200" :
                "bg-gray-100 text-gray-800 border-gray-200";

    const riskColor =
        risk === "Low" ? "success" :
            risk === "Medium" ? "warning" :
                "destructive";

    return (
        <Card className="w-full relative overflow-hidden border-l-4 group" style={{
            borderLeftColor: type === "BUY" ? "#10b981" : type === "SELL" ? "#ef4444" : "#9ca3af"
        }}>
            {isLocked && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/50 flex flex-col items-center justify-center text-center p-6 border border-amber-500/20">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-3 animate-pulse">
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">توصية خاصة</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
                        هذه التوصية متاحة للمشتركين فقط. رقي حسابك للوصول.
                    </p>
                    <a href="/account" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all text-sm">
                        ترقية الاشتراك
                    </a>
                </div>
            )}

            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10">
                <div className="flex flex-col">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {asset}
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${typeColor}`}>
                            {type}
                        </span>
                    </CardTitle>
                    <span className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> {date}
                    </span>
                </div>
                {!isLocked && (
                    <button
                        onClick={onShare}
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                        aria-label="Share on WhatsApp"
                    >
                        <Share2 className="w-4 h-4 text-primary" />
                    </button>
                )}
            </CardHeader>

            <CardContent className="space-y-3 relative z-10">
                {/* Price Levels */}
                <div className="flex items-center justify-between text-sm p-2 bg-secondary/30 rounded-md">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">دخول</span>
                        <span className="font-semibold">{isLocked ? "****" : price}</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-xs text-muted-foreground">هدف</span>
                        <span className="font-semibold text-emerald-600">{isLocked ? "****" : target}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-xs text-muted-foreground">وقف خسارة</span>
                        <span className="font-semibold text-red-600">{isLocked ? "****" : stopLoss}</span>
                    </div>
                </div>

                {/* Rationale */}
                <div>
                    <p className={`text-sm text-foreground leading-relaxed ${isLocked ? 'blur-sm select-none' : ''}`}>
                        {isLocked ? "هذا النص مخفي للمشتركين فقط هذا النص مخفي للمشتركين فقط." : rationale}
                    </p>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <Badge variant={riskColor} className="flex items-center gap-1">
                        {risk === "Low" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {risk === "Low" ? "مخاطرة منخفضة" : risk === "Medium" ? "مخاطرة متوسطة" : "مخاطرة عالية"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">تحليل فني</span>
                </div>
            </CardContent>
        </Card>
    );
}
