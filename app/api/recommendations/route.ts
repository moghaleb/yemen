import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const recommendations = await prisma.recommendation.findMany({
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(recommendations);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching recommendations" }, { status: 500 });
    }
}
