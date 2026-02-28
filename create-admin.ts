import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const hashedPassword = await bcrypt.hash('admin', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@aa' },
        update: { role: 'ADMIN', password: hashedPassword },
        create: {
            name: 'Admin',
            email: 'admin@aa',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin created:', admin.email, '| role:', admin.role);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
