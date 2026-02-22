"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
    tier: string;
    pendingRequest?: { requestedTier: string };
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    children: React.ReactNode;
}

export default function SubscribeButton({ tier, pendingRequest, className, variant = "default", children }: SubscribeButtonProps) {
    const router = useRouter();

    const isRequested = pendingRequest?.requestedTier === tier;

    const handleSubscribe = () => {
        router.push(`/subscribe/confirm?tier=${tier}`);
    };

    return (
        <Button
            onClick={handleSubscribe}
            disabled={isRequested}
            className={className}
            variant={variant}
            type="button"
        >
            {isRequested ? 'تم إرسال الطلب ⏳' : children}
        </Button>
    );
}
