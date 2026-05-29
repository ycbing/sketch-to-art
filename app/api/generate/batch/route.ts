import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artworks, creditsUsage, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { generateImage } from "@/lib/ai/image-generator";
import { uploadBase64ToCos, uploadUrlToCos, isCosConfigured } from "@/lib/cos";
import { buildStylePrompt } from "@/lib/styles";

// POST /api/generate/batch — batch generate 2-4 images
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { sketchBase64, styleId, prompt, styleStrength = 80, count = 2 } = body;

    if (!styleId) {
      return NextResponse.json({ error: "请选择风格" }, { status: 400 });
    }

    const validCount = Math.min(Math.max(count, 2), 4);
    const totalCredits = validCount * 3;

    // Check credits with row-level lock
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .for("update");

    if (!userRows.length) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    if ((userRows[0].credits ?? 0) < totalCredits) {
      return NextResponse.json(
        { error: `积分不足，需要 ${totalCredits} 积分` },
        { status: 400 }
      );
    }

    // Deduct credits first (atomic operation)
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - ${totalCredits}` })
      .where(eq(users.id, session.user.id));

    const stylePrompt = buildStylePrompt(styleId, prompt || "", styleStrength);

    try {
      // Upload sketch
      let sketchCosUrl: string | null = null;
      if (sketchBase64 && isCosConfigured()) {
        try {
          const sketchKey = `sketch-to-art/sketches/${uuid()}.png`;
          sketchCosUrl = await uploadBase64ToCos(sketchBase64, sketchKey);
        } catch (e) {
          console.error("Sketch upload failed:", e);
        }
      }

      // Generate multiple images in parallel
      const imagePromises = Array.from({ length: validCount }, () =>
        generateImage({
          prompt: prompt || "a beautiful artwork",
          stylePrompt,
          sketchBase64: sketchBase64 || undefined,
        })
      );

      const imageUrls = await Promise.all(imagePromises);

      // Upload results to COS
      const resultUrls = await Promise.all(
        imageUrls.map(async (url, i) => {
          if (isCosConfigured()) {
            try {
              const resultKey = `sketch-to-art/results/${uuid()}-${i}.png`;
              return await uploadUrlToCos(url, resultKey);
            } catch (e) {
              console.error(`Result upload failed for image ${i}:`, e);
            }
          }
          return url;
        })
      );

      // Save artwork
      const artworkId = uuid();
      await db.insert(artworks).values({
        id: artworkId,
        userId: session.user.id,
        styleId,
        title: prompt || "无题",
        prompt: prompt || "",
        sketchUrl: sketchCosUrl,
        resultUrl: resultUrls[0],
        resultUrls: JSON.stringify(resultUrls),
        styleStrength,
        size: "1024x1024",
      });

      await db.insert(creditsUsage).values({
        id: uuid(),
        userId: session.user.id,
        action: "generate_batch",
        amount: totalCredits,
        artworkId,
      });

      return NextResponse.json({
        success: true,
        artworkId,
        imageUrls: resultUrls,
      });
    } catch (error) {
      // Refund credits on generation failure
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + ${totalCredits}` })
        .where(eq(users.id, session.user.id));

      console.error("Batch generate error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "批量生成失败" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Batch generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "批量生成失败" },
      { status: 500 }
    );
  }
}