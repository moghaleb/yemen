'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default function NotificationPermission() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            registerServiceWorker();
        }
    }, []);

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });

            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    async function subscribeToPush() {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('تم رفض الإذن بالإشعارات. يرجى تفعيلها من إعدادات المتصفح.');
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
            });

            setSubscription(sub);
            await saveSubscription(sub);
            alert('تم تفعيل الإشعارات بنجاح! 🔔');
        } catch (error) {
            console.error('Failed to subscribe:', error);
            alert('فشل تفعيل الإشعارات. يرجى المحاولة مرة أخرى.');
        }
    }

    async function saveSubscription(sub: PushSubscription) {
        await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sub),
        });
    }

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if (subscription) {
        return (
            <Button variant="ghost" size="sm" className="gap-2 text-green-500 font-medium cursor-default hover:bg-transparent">
                <Bell className="w-4 h-4 fill-current" />
                الإشعارات مفعلة
            </Button>
        );
    }

    return (
        <Button variant="outline" size="sm" onClick={subscribeToPush} className="gap-2">
            <Bell className="w-4 h-4" />
            تفعيل الإشعارات
        </Button>
    );
}
