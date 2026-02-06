import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, Share2 } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
    const videos = await prisma.educationalContent.findMany({
        where: { type: "VIDEO" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4 flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">الفيديوهات التعليمية</h1>
            </header>

            <main className="container flex-1 py-6 px-4 space-y-4">
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden">
                            {/* Video Placeholder or Link */}
                            <a href={video.url || "#"} target="_blank" rel="noopener noreferrer" className="block">
                                <div className="aspect-video bg-muted flex items-center justify-center relative cursor-pointer group">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                                    <PlayCircle className="w-12 h-12 text-primary opacity-80 group-hover:opacity-100 transition-opacity scale-100 group-hover:scale-110 transform duration-200" />
                                    {video.isPremium && (
                                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded font-bold">
                                            VIP
                                        </span>
                                    )}
                                </div>
                            </a>

                            <CardContent className="p-4">
                                <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {video.summary}
                                </p>
                                <div className="flex gap-2">
                                    <a href={video.url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1">
                                        <Button size="sm" className="w-full">شاهد الآن</Button>
                                    </a>
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        لا توجد فيديوهات حالياً.
                    </div>
                )}
            </main>
        </div>
    );
}
