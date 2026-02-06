import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "file:./dev.db",
        },
    },
})

async function main() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL)
    console.log('Start seeding ...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.upsert({
        where: { email: 'admin@yemen.com' },
        update: {
            role: 'ADMIN',
        },
        create: {
            email: 'admin@yemen.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log({ user })

    // Create Recommendations
    await prisma.recommendation.createMany({
        data: [
            {
                type: 'GOLD',
                action: 'BUY',
                price: 2045.50,
                stopLoss: 2030.00,
                takeProfit: 2060.00,
                rationale: 'Strong support at 2030, bullish momentum indicators.',
                status: 'ACTIVE',
            },
            {
                type: 'STOCK',
                action: 'SELL',
                price: 150.25,
                stopLoss: 155.00,
                takeProfit: 142.00,
                rationale: 'Overbought conditions on daily timeframe.',
                status: 'ACTIVE',
            },
        ],
    })

    // Create News
    await prisma.newsItem.createMany({
        data: [
            {
                title: 'Central Bank Rates Unchanged',
                summary: 'The Central Bank decided to keep interest rates steady at 5.25%.',
                impact: 'HIGH',
                source: 'Financial Times',
            },
            {
                title: 'Gold Hits All-Time High',
                summary: 'Gold prices surged past $2100 amidst global uncertainty.',
                impact: 'MEDIUM',
                source: 'Bloomberg',
            },
        ],
    })

    // Create Educational Content
    await prisma.educationalContent.createMany({
        data: [
            {
                title: 'Introduction to Technical Analysis',
                type: 'ARTICLE',
                summary: 'Learn the basics of chart patterns and indicators.',
                url: 'https://example.com/article1',
            },
            {
                title: 'Trading Psychology 101',
                type: 'VIDEO',
                summary: 'Master your emotions to become a better trader.',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                isPremium: true,
            },
            {
                title: 'Complete Forex Trading Course',
                type: 'VIDEO',
                summary: 'A comprehensive guide for beginners to start trading forex.',
                url: 'https://www.youtube.com/watch?v=cx7sWv59a4s',
                isPremium: false,
            },
            {
                title: 'Understanding Candlestick Patterns',
                type: 'VIDEO',
                summary: 'Learn how to read and interpret candlestick charts effectively.',
                url: 'https://www.youtube.com/watch?v=C35l8F7e6pM',
                isPremium: false,
            },
        ],
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
