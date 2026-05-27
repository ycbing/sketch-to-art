import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artworks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// DELETE /api/artworks/[id] — delete an artwork
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const rows = await db
      .select()
      .from(artworks)
      .where(and(eq(artworks.id, id), eq(artworks.userId, session.user.id)))
      .limit(1);

    if (!rows.length) {
      return NextResponse.json({ error: "作品不存在" }, { status: 404 });
    }

    await db
      .delete(artworks)
      .where(eq(artworks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete artwork error:", error);
    return NextResponse.json({ error: "删除作品失败" }, { status: 500 });
  }
}
