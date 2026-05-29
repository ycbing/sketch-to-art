import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { artworks, creditsUsage, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { generateImage } from "@/lib/ai/image-generator";
import { uploadBase64ToCos, uploadUrlToCos, isCosConfigured } from "@/lib/cos";
import { buildStylePrompt } from "@/lib/styles";

const CREDITS_PER_GENERATION = 3;

// POST /api/generate — single image generation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { sketchBase64, styleId, prompt, styleStrength = 80 } = body;

    if (!styleId) {
      return NextResponse.json({ error: "请选择风格" }, { status: 400 });
    }

    // Check credits with row-level lock to prevent race conditions
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .for("update");

    if (!userRows.length) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    if ((userRows[0].credits ?? 0) < CREDITS_PER_GENERATION) {
      return NextResponse.json(
        { error: "积分不足，请先领取每日签到奖励" },
        { status: 400 }
      );
    }

    const stylePrompt = buildStylePrompt(styleId, prompt || "", styleStrength);

    // Deduct credits first (atomic operation)
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - ${CREDITS_PER_GENERATION}` })
      .where(eq(users.id, session.user.id));

    try {
      // Generate image
      const imageUrl = await generateImage({
        prompt: prompt || "a beautiful artwork",
        stylePrompt,
        sketchBase64: sketchBase64 || undefined,
      });

      // Upload sketch to COS
      let sketchCosUrl: string | null = null;
      if (sketchBase64 && isCosConfigured()) {
        try {
          const sketchKey = `sketch-to-art/sketches/${uuid()}.png`;
          sketchCosUrl = await uploadBase64ToCos(sketchBase64, sketchKey);
        } catch (e) {
          console.error("Sketch upload failed:", e);
        }
      }

      // Upload generated image to COS
      let resultCosUrl = imageUrl;
      if (isCosConfigured()) {
        try {
          const resultKey = `sketch-to-art/results/${uuid()}.png`;
          resultCosUrl = await uploadUrlToCos(imageUrl, resultKey);
        } catch (e) {
          console.error("Result upload failed:", e);
        }
      }

      // Save artwork
      const artworkId = uuid();
      await db.insert(artworks).values({
        id: artworkId,
        userId: session.user.id,
        styleId,
        title: prompt || "无题",
        prompt: prompt || "",
        sketchUrl: sketchCosUrl,
        resultUrl: resultCosUrl,
        styleStrength,
        size: "1024x1024",
      });

      await db.insert(creditsUsage).values({
        id: uuid(),
        userId: session.user.id,
        action: "generate_single",
        amount: CREDITS_PER_GENERATION,
        artworkId,
      });

      return NextResponse.json({
        success: true,
        artworkId,
        imageUrl: resultCosUrl,
      });
    } catch (error) {
      // Refund credits on generation failure
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + ${CREDITS_PER_GENERATION}` })
        .where(eq(users.id, session.user.id));

      console.error("Generate error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "生成失败" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "生成失败" },
      { status: 500 }
    );
  }
}