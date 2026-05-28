import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artworks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteFromCos, isCosConfigured } from "@/lib/cos";

function extractCosKey(url: string): string | null {
  try {
    const u = new URL(url);
    const bucket = process.env.COS_BUCKET || "";
    const region = process.env.COS_REGION || "";
    const prefix = `https://${bucket}.cos.${region}.myqcloud.com/`;
    if (url.startsWith(prefix)) {
      return url.slice(prefix.length);
    }
    return null;
  } catch {
    return null;
  }
}

async function cleanupCosFiles(artwork: {
  sketchUrl: string | null;
  resultUrl: string | null;
  resultUrls: string | null;
}) {
  if (!isCosConfigured()) return;

  const keysToDelete: string[] = [];

  if (artwork.sketchUrl) {
    const key = extractCosKey(artwork.sketchUrl);
    if (key) keysToDelete.push(key);
  }
  if (artwork.resultUrl) {
    const key = extractCosKey(artwork.resultUrl);
    if (key) keysToDelete.push(key);
  }
  if (artwork.resultUrls) {
    try {
      const urls: string[] = JSON.parse(artwork.resultUrls);
      for (const url of urls) {
        const key = extractCosKey(url);
        if (key) keysToDelete.push(key);
      }
    } catch {}
  }

  await Promise.allSettled(
    keysToDelete.map((key) => deleteFromCos(key))
  );
}

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

    // Clean up COS files
    await cleanupCosFiles(rows[0]);

    await db
      .delete(artworks)
      .where(eq(artworks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete artwork error:", error);
    return NextResponse.json({ error: "删除作品失败" }, { status: 500 });
  }
}
