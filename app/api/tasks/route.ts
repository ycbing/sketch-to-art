import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTask } from "@/lib/ai/task-manager";
import { getConfiguredProvider } from "@/lib/ai/image-generator";
import { rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

const CREDITS_PER_IMAGE = 3;

// POST /api/tasks — create an async generation task
export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { styleId, prompt, styleStrength = 80, count = 1, sketchBase64 } = body;

    if (!styleId) {
      return NextResponse.json({ error: "请选择风格" }, { status: 400 });
    }

    const validCount = Math.min(Math.max(count, 1), 4);
    const totalCredits = validCount * CREDITS_PER_IMAGE;

    const provider = getConfiguredProvider();
    if (!provider) {
      return NextResponse.json({ error: "图像生成服务未配置" }, { status: 503 });
    }

    // Check + deduct credits atomically
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

    // Deduct credits atomically before starting background task
    await db
      .update(users)
      .set({ credits: sql`${users.credits} - ${totalCredits}` })
      .where(eq(users.id, session.user.id));

    const taskId = await createTask({
      userId: session.user.id,
      provider: provider.id,
      prompt: prompt || "",
      styleId,
      styleStrength,
      count: validCount,
    });

    // Start generation in background (non-blocking)
    processGenerationTask(taskId, {
      userId: session.user.id,
      styleId,
      prompt: prompt || "",
      styleStrength,
      sketchBase64: sketchBase64 || undefined,
      count: validCount,
      totalCredits,
      provider,
    }).catch((err) => console.error("Background task error:", err));

    return NextResponse.json({ taskId, status: "pending" });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "创建任务失败" },
      { status: 500 }
    );
  }
}

async function processGenerationTask(
  taskId: string,
  params: {
    userId: string;
    styleId: string;
    prompt: string;
    styleStrength: number;
    sketchBase64?: string;
    count: number;
    totalCredits: number;
    provider: ReturnType<typeof getConfiguredProvider>;
  }
) {
  const { updateTaskStatus, updateTaskProgress } = await import("@/lib/ai/task-manager");
  const { buildStylePrompt } = await import("@/lib/styles");
  const { generateImage: genImg } = await import("@/lib/ai/image-generator");
  const { uploadBase64ToCos, uploadUrlToCos, isCosConfigured } = await import("@/lib/cos");
  const { artworks, creditsUsage } = await import("@/lib/db/schema");
  const { v4: uuid } = await import("uuid");

  try {
    await updateTaskStatus(taskId, "processing", { progress: 10 });

    const stylePrompt = buildStylePrompt(params.styleId, params.prompt, params.styleStrength);

    await updateTaskProgress(taskId, 30);

    const imagePromises = Array.from({ length: params.count }, () =>
      genImg({
        prompt: params.prompt || "a beautiful artwork",
        stylePrompt,
        sketchBase64: params.sketchBase64,
      })
    );
    const imageUrls = await Promise.all(imagePromises);

    await updateTaskProgress(taskId, 70);

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

    await updateTaskProgress(taskId, 90);

    // Upload sketch if provided
    let sketchCosUrl: string | null = null;
    if (params.sketchBase64 && isCosConfigured()) {
      try {
        const sketchKey = `sketch-to-art/sketches/${uuid()}.png`;
        sketchCosUrl = await uploadBase64ToCos(params.sketchBase64, sketchKey);
      } catch (e) {
        console.error("Sketch upload failed:", e);
      }
    }

    // Save artwork
    const artworkId = uuid();
    await db.insert(artworks).values({
      id: artworkId,
      userId: params.userId,
      styleId: params.styleId,
      title: params.prompt || "无题",
      prompt: params.prompt || "",
      sketchUrl: sketchCosUrl,
      resultUrl: resultUrls[0],
      resultUrls: JSON.stringify(resultUrls),
      provider: params.provider?.id,
      styleStrength: params.styleStrength,
    });

    // Record credits usage (credits already deducted synchronously)
    await db.insert(creditsUsage).values({
      id: uuid(),
      userId: params.userId,
      action: params.count > 1 ? "generate_batch" : "generate_single",
      amount: params.totalCredits,
      artworkId,
    });

    await updateTaskStatus(taskId, "completed", { resultUrls, progress: 100 });
  } catch (error) {
    console.error("Generation task failed:", error);
    await updateTaskStatus(taskId, "failed", {
      error: error instanceof Error ? error.message : "生成失败",
    });

    // Refund credits on failure (credits were deducted synchronously before task)
    try {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + ${params.totalCredits}` })
        .where(eq(users.id, params.userId));
    } catch (refundErr) {
      console.error("Credit refund failed:", refundErr);
    }
  }
}