"use client";

import { Crown, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
    {
        id: "VIP",
        name: "باقة VIP",
        price: "100$",
        icon: Crown,
        color: "text-[#D4AF37]",
        bg: "bg-[#D4AF37]/10",
        border: "border-[#D4AF37]/50"
    },
    {
        id: "BASIC",
        name: "الباقة الأساسية",
        price: "50$",
        icon: Star,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/50"
    }
];

export default function SubscriptionTicker() {
    const router = useRouter();

    const handleSelect = (planId: string) => {
        router.push(`/subscribe/confirm?tier=${planId}`);
    };

    return (
        <div className="relative w-full overflow-hidden py-4 bg-background/50 backdrop-blur-sm border-y border-white/5" dir="ltr">
            <div className="flex animate-scroll gap-4 min-w-max">
                {[...plans, ...plans, ...plans, ...plans].map((plan, i) => (
                    <div
                        key={`${plan.id}-${i}`}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${plan.border} ${plan.bg} min-w-[200px] cursor-pointer hover:scale-105 transition-transform`}
                        onClick={() => handleSelect(plan.id)}
                    >
                        <plan.icon className={`w-5 h-5 ${plan.color}`} />
                        <div>
                            <h3 className={`font-bold text-sm ${plan.color}`}>{plan.name}</h3>
                            <p className="text-xs text-muted-foreground">{plan.price} / شهرياً</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-25%); } 
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
