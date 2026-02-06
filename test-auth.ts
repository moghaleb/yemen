import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`1. Testing Registration for ${email}...`);

    // Simulate Registration
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('   Generated Hash:', hashedPassword);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Test User',
            role: 'FREE'
        }
    });
    console.log('   User created in DB:', user.id);

    // Simulate Login
    console.log('\n2. Testing Login...');
    const fetchedUser = await prisma.user.findUnique({ where: { email } });

    if (!fetchedUser) {
        console.error('   ❌ FAILED: User not found in DB');
        return;
    }
    console.log('   User fetched:', fetchedUser.email);
    console.log('   Stored Hash:', fetchedUser.password);

    const match = await bcrypt.compare(password, fetchedUser.password);
    console.log(`   Password Match Result: ${match}`);

    if (match) {
        console.log('\n✅ SUCCESS: Auth logic is working correctly.');
    } else {
        console.error('\n❌ FAILED: Password comparison failed.');
    }

    // Cleanup
    await prisma.user.delete({ where: { email } });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
