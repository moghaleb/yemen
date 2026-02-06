import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const news = await prisma.newsItem.findMany({
            orderBy: { publishedAt: "desc" },
            take: 20,
        });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching news" }, { status: 500 });
    }
}
