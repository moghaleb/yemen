import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSubscriptions() {
    const subs = await prisma.pushSubscription.findMany();
    console.log(`Total active push subscriptions: ${subs.length}`);
    if (subs.length > 0) {
        console.dir(subs, { depth: null });
    }
}

checkSubscriptions().catch(console.error).finally(() => prisma.$disconnect());
