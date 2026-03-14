import { prisma } from './lib/prisma';

async function main() {
    const adminAA = await prisma.user.findUnique({ where: { email: 'admin@aa' } });
    const adminAdmin = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } });

    console.log('Admin (admin@aa):', adminAA ? 'Exists' : 'Not Found');
    if (adminAA) console.log('Role:', adminAA.role);

    console.log('Admin (admin@admin.com):', adminAdmin ? 'Exists' : 'Not Found');
    if (adminAdmin) console.log('Role:', adminAdmin.role);
}

main().finally(() => prisma.$disconnect());
