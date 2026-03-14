import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'admin@aa' } });
    if (!user) {
        console.log('User admin@aa not found');
        return;
    }

    const passwordsToTry = ['admin', 'admin123', 'admin@123'];

    for (const pw of passwordsToTry) {
        const match = await bcrypt.compare(pw, user.password);
        console.log(`Password "${pw}" for admin@aa match: ${match}`);
        if (match) {
            console.log('FOUND WORKING PASSWORD:', pw);
            break;
        }
    }
}

main().finally(() => prisma.$disconnect());
