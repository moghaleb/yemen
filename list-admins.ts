import { prisma } from './lib/prisma';

async function main() {
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
    });

    console.log('Admins in Database:');
    admins.forEach(admin => {
        console.log(`- Email: ${admin.email}, Name: ${admin.name}`);
    });
}

main().finally(() => prisma.$disconnect());
