import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, creditsUsage } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/credits — get user's credit balance and recent usage
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!userRows.length) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const recentUsage = await db
      .select()
      .from(creditsUsage)
      .where(eq(creditsUsage.userId, session.user.id))
      .orderBy(desc(creditsUsage.createdAt))
      .limit(20);

    return NextResponse.json({
      credits: userRows[0].credits ?? 0,
      recentUsage,
    });
  } catch (error) {
    console.error("Get credits error:", error);
    return NextResponse.json({ error: "获取积分失败" }, { status: 500 });
  }
}

// POST /api/credits — add credits (admin/daily-bonus)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount } = body;

    if (action === "daily_bonus") {
      // Add 10 credits as daily bonus
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + 10` })
        .where(eq(users.id, session.user.id));

      return NextResponse.json({ success: true, added: 10 });
    }

    if (amount && amount > 0) {
      await db
        .update(users)
        .set({ credits: sql`${users.credits} + ${amount}` })
        .where(eq(users.id, session.user.id));

      return NextResponse.json({ success: true, added: amount });
    }

    return NextResponse.json({ error: "无效操作" }, { status: 400 });
  } catch (error) {
    console.error("Update credits error:", error);
    return NextResponse.json({ error: "操作积分失败" }, { status: 500 });
  }
}
