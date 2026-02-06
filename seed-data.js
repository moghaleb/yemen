const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create a Gold Recommendation
    await prisma.recommendation.create({
        data: {
            type: 'GOLD',
            action: 'BUY',
            price: 2045.50,
            takeProfit: 2060.00,
            stopLoss: 2035.00,
            rationale: 'Strong support at 2040, expecting bounce back up.',
            status: 'ACTIVE'
        }
    });

    // Create a Stock Recommendation
    await prisma.recommendation.create({
        data: {
            type: 'STOCK',
            action: 'HOLD',
            price: 150.25,
            takeProfit: 160.00,
            stopLoss: 145.00,
            rationale: 'Apple stock consolidating. Wait for breakout.',
            status: 'ACTIVE'
        }
    });

    // Create News Items
    await prisma.newsItem.create({
        data: {
            title: 'Global Markets Rally',
            summary: 'Major indices hit all-time highs as inflation cools.',
            impact: 'HIGH'
        }
    });

    await prisma.newsItem.create({
        data: {
            title: 'Gold steady ahead of Fed meeting',
            summary: 'Traders await interest rate decision.',
            impact: 'MEDIUM'
        }
    });

    console.log('Seed data created');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
