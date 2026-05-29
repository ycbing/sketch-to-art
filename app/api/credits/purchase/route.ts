import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, creditsUsage } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

const VALID_PLANS: Record<string, number> = {
  starter: 100,
  creator: 500,
  pro: 1500,
};

// POST /api/credits/purchase — purchase credit package
export async function POST(request: NextRequest) {
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, credits } = body;

    if (!planId || !VALID_PLANS[planId]) {
      return NextResponse.json({ error: "无效的套餐" }, { status: 400 });
    }

    if (credits !== VALID_PLANS[planId]) {
      return NextResponse.json({ error: "套餐积分不匹配" }, { status: 400 });
    }

    // In production: integrate payment gateway (WeChat Pay / Alipay) here
    // For now: direct credit addition (simulate payment success)

    await db
      .update(users)
      .set({ credits: sql`${users.credits} + ${credits}` })
      .where(eq(users.id, session.user.id));

    await db.insert(creditsUsage).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      action: `purchase_${planId}`,
      amount: -credits,
    });

    return NextResponse.json({ success: true, added: credits });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json({ error: "购买失败，请重试" }, { status: 500 });
  }
}