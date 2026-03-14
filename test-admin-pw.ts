import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'admin@admin.com' } });
    if (!user) {
        console.log('User admin@admin.com not found');
        return;
    }

    const passwordsToTry = ['admin', 'admin123', 'password123'];

    for (const pw of passwordsToTry) {
        const match = await bcrypt.compare(pw, user.password);
        console.log(`Password "${pw}" match: ${match}`);
        if (match) {
            console.log('FOUND WORKING PASSWORD:', pw);
            break;
        }
    }
}

main().finally(() => prisma.$disconnect());
