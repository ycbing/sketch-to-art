import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artworks } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

// POST /api/gallery/[id]/like — like/unlike an artwork
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    const rows = await db
      .select()
      .from(artworks)
      .where(eq(artworks.id, id))
      .limit(1);

    if (!rows.length) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    await db
      .update(artworks)
      .set({ likes: sql`${artworks.likes} + 1` })
      .where(eq(artworks.id, id));

    return NextResponse.json({ success: true, likes: (rows[0].likes ?? 0) + 1 });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}