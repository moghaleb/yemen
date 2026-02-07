"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { requestSubscription } from "@/app/actions/subscription"; // This will need a workaround if imported directly in client component from server action file
import { useRouter } from "next/navigation";

// Note: Server actions can be imported into Client Components in Next.js.

interface SubscribeButtonProps {
    tier: string;
    pendingRequest?: { requestedTier: string };
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    children: React.ReactNode;
}

export default function SubscribeButton({ tier, pendingRequest, className, variant = "default", children }: SubscribeButtonProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubscribe = async () => {
        startTransition(async () => {
            // Create FormData manually since we are not using a form element
            const formData = new FormData();
            formData.append("tier", tier);

            const result = await requestSubscription(formData);

            if (result.success) {
                alert(result.message);
                router.refresh(); // Refresh to update UI state (pending/current)
            } else {
                alert(result.message);
            }
        });
    };

    const isRequested = pendingRequest?.requestedTier === tier;

    return (
        <Button
            onClick={handleSubscribe}
            disabled={isPending || isRequested} // Disable if action pending or already requested
            className={className}
            variant={variant}
            type="button" // Important: not submit
        >
            {isPending ? 'جاري الإرسال...' : (isRequested ? 'تم إرسال الطلب ⏳' : children)}
        </Button>
    );
}
