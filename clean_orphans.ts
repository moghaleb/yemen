import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clean() {
    try {
        console.log("Starting diagnostic and cleanup...");
        const reqs = await prisma.subscriptionRequest.findMany();
        console.log(`Found ${reqs.length} total requests.`);

        let count = 0;
        for (const r of reqs) {
            const u = await prisma.user.findUnique({ where: { id: r.userId } });
            if (!u) {
                console.log(`Deleting orphaned Request ID: ${r.id} for missing User ID: ${r.userId}`);
                await prisma.subscriptionRequest.delete({ where: { id: r.id } });
                count++;
            }
        }
        console.log(`Cleanup complete. Deleted ${count} orphaned requests.`);
    } catch (e) {
        console.error("Error during cleanup:", e);
    } finally {
        await prisma.$disconnect();
    }
}

clean();
