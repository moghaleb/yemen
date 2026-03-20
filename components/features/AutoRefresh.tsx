"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            // router.refresh() fetches the latest Server Component payload silently
            // without losing client React state or scrolling position.
            router.refresh();
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [router, intervalMs]);

    return null; // This component has no UI
}
