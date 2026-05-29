import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artworks, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/gallery — public artworks with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(30, Math.max(1, Number(searchParams.get("limit")) || 12));
    const offset = (page - 1) * limit;

    const rows = await db
      .select()
      .from(artworks)
      .where(eq(artworks.isPublic, true))
      .orderBy(desc(artworks.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ artworks: rows, page, limit });
  } catch (error) {
    console.error("Gallery error:", error);
    return NextResponse.json({ error: "获取画廊失败" }, { status: 500 });
  }
}