'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Helpers ---

// Placeholder for auth check - in real app, verify session/cookie
async function requireAdmin() {
    // TODO: Implement actual session check
    // For now, we assume if you can call this, you are authorized or layout blocked you.
    // In a real app, strict middleware + session validation is needed.
    return true;
}

// --- Recommendations ---

import webpush from 'web-push';

// Configure web-push
webpush.setVapidDetails(
    'mailto:moghaleb@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

async function sendNotificationToAll(payload: any) {
    try {
        const subscriptions = await prisma.pushSubscription.findMany();
        console.log(`Sending notification to ${subscriptions.length} subscribers`);

        const notifications = subscriptions.map(sub => {
            return webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            }, JSON.stringify(payload)).catch(err => {
                console.error("Error sending to subscription", err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription expired or invalid, delete it
                    return prisma.pushSubscription.delete({ where: { id: sub.id } });
                }
            });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error("Error sending notifications", error);
    }
}

// ... existing code ...

export async function createRecommendation(formData: FormData) {
    await requireAdmin();

    const type = formData.get("type") as string;
    const action = formData.get("action") as string;
    const price = parseFloat(formData.get("price") as string);
    const stopLoss = formData.get("stopLoss") ? parseFloat(formData.get("stopLoss") as string) : null;
    const takeProfit = formData.get("takeProfit") ? parseFloat(formData.get("takeProfit") as string) : null;
    const rationale = formData.get("rationale") as string;
    const minTier = formData.get("minTier") as string || "FREE";

    const recommendation = await prisma.recommendation.create({
        data: {
            type,
            action,
            price,
            stopLoss,
            takeProfit,
            rationale,
            minTier,
            status: "ACTIVE",
        },
    });

    // Send Notification
    await sendNotificationToAll({
        title: `توصية جديدة: ${type} ${action}`,
        body: `السعر: ${price} - الهدف: ${takeProfit}`,
        url: '/'
    });

    revalidatePath("/");
    revalidatePath("/recommendations");
    revalidatePath("/admin/recommendations");
    redirect("/admin/recommendations");
}

export async function deleteRecommendation(id: string) {
    await requireAdmin();

    await prisma.recommendation.delete({
        where: { id },
    });

    revalidatePath("/admin/recommendations");
    revalidatePath("/recommendations");
    revalidatePath("/");
}

export async function createNews(formData: FormData) {
    await requireAdmin();

    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const impact = formData.get("impact") as string;
    const source = formData.get("source") as string;

    const news = await prisma.newsItem.create({
        data: {
            title,
            summary,
            impact,
            source,
            category: formData.get("category") as string || "GENERAL",
            minTier: formData.get("minTier") as string || "FREE",
        },
    });

    // Send Notification
    await sendNotificationToAll({
        title: `خبر عاجل: ${title}`,
        body: summary.substring(0, 100) + '...',
        url: '/#news'
    });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin/news");
    redirect("/admin/news");
}

export async function deleteNews(id: string) {
    await requireAdmin();

    await prisma.newsItem.delete({
        where: { id },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath("/news");
    revalidatePath("/news");
    revalidatePath("/");
}

// --- Educational Content ---

export async function createEducationalContent(formData: FormData) {
    await requireAdmin();

    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const type = formData.get("type") as string; // VIDEO, ARTICLE, ANALYSIS
    const url = formData.get("url") as string;
    const category = formData.get("category") as string || "GENERAL";
    const isPremium = formData.get("isPremium") === "on";

    await prisma.educationalContent.create({
        data: {
            title,
            summary,
            type,
            url,
            category,
            isPremium,
        },
    });

    revalidatePath("/");
    revalidatePath("/education");
    revalidatePath("/admin/education");
    redirect("/admin/education");
}

export async function deleteEducationalContent(id: string) {
    await requireAdmin();

    await prisma.educationalContent.delete({
        where: { id },
    });

    revalidatePath("/admin/education");
    revalidatePath("/education");
    revalidatePath("/");
}

// --- Subscription Requests ---

export async function approveSubscriptionRequest(requestId: string) {
    await requireAdmin();

    const request = await prisma.subscriptionRequest.findUnique({
        where: { id: requestId },
        include: { user: true }
    });

    if (!request || request.status !== 'PENDING') {
        throw new Error("Invalid request");
    }

    // Default expiry: 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    // Update User and Request in transaction
    await prisma.$transaction([
        prisma.user.update({
            where: { id: request.userId },
            data: {
                subscriptionTier: request.requestedTier,
                subscriptionExpiry: expiry
            }
        }),
        prisma.subscriptionRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED' }
        })
    ]);

    revalidatePath("/admin/requests");
    revalidatePath("/admin/users");
}

export async function rejectSubscriptionRequest(requestId: string) {
    await requireAdmin();

    await prisma.subscriptionRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
    });

    revalidatePath("/admin/requests");
}
