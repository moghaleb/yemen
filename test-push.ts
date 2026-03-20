import { PrismaClient } from '@prisma/client';
import webpush from 'web-push';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

webpush.setVapidDetails(
    'mailto:test@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

async function testPush() {
    console.log("Checking VAPID Keys in env...");
    console.log("PUBLIC_KEY length:", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.length || 0);
    console.log("PRIVATE_KEY length:", process.env.VAPID_PRIVATE_KEY?.length || 0);

    const subscriptions = await prisma.pushSubscription.findMany();
    console.log(`Found ${subscriptions.length} active push subscriptions in DB.`);

    if (subscriptions.length === 0) {
        console.log("❌ User has no active subscriptions. The client has not successfully saved a subscription.");
        return;
    }

    const payload = JSON.stringify({
        title: 'Tester 1',
        body: 'Diagnostic push notification from CLI test script.',
        url: '/'
    });

    let successCount = 0;
    for (const sub of subscriptions) {
        try {
            console.log(`Attempting push to endpoint: ${sub.endpoint.substring(0, 30)}...`);
            await webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            }, payload);
            console.log("✅ Success!");
            successCount++;
        } catch (error: any) {
            console.error("❌ Failed:", error.name, error.message);
            if (error.statusCode) console.error("Status code:", error.statusCode);
            if (error.body) console.error("Body:", error.body);
        }
    }
    
    console.log(`\nTest complete. Succesfully pushed to ${successCount} out of ${subscriptions.length} endpoints.`);
}

testPush().finally(() => prisma.$disconnect());
