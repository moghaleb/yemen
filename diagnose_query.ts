import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function diagnose() {
    try {
        console.log("Fetching RAW requests...");
        const raw = await prisma.subscriptionRequest.findMany();
        console.log("Successfully fetched RAW. Count:", raw.length);

        console.log("Fetching WITH inclusion...");
        const withUser = await prisma.subscriptionRequest.findMany({
            include: { user: true }
        });
        console.log("Successfully fetched WITH USER. Count:", withUser.length);

    } catch (e) {
        console.error("DIAGNOSTIC FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
