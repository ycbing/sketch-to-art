import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artworks } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/artworks — list user's artworks
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(artworks)
      .where(eq(artworks.userId, session.user.id))
      .orderBy(desc(artworks.createdAt))
      .limit(50);

    return NextResponse.json({ artworks: rows });
  } catch (error) {
    console.error("List artworks error:", error);
    return NextResponse.json({ error: "获取作品列表失败" }, { status: 500 });
  }
}

// POST /api/artworks — create/update artwork
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, isPublic } = body;

    if (!id) {
      return NextResponse.json({ error: "作品ID必填" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (isPublic !== undefined) updates.isPublic = isPublic;

    await db
      .update(artworks)
      .set(updates)
      .where(eq(artworks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update artwork error:", error);
    return NextResponse.json({ error: "更新作品失败" }, { status: 500 });
  }
}
