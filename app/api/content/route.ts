import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // ARTICLE or VIDEO

    try {
        const where = type ? { type: type.toUpperCase() } : {};
        const content = await prisma.educationalContent.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching content" }, { status: 500 });
    }
}
