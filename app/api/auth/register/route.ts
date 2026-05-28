import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, userPasswords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

// POST /api/auth/register — register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "邮箱和密码（至少6位）必填" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.email, email.toLowerCase()))
      .limit(1);

    if (existing.length) {
      return NextResponse.json(
        { error: "该邮箱已注册" },
        { status: 409 }
      );
    }

    const userId = uuid();
    const passwordHash = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      name: name || email.split("@")[0],
      credits: 50,
    });

    await db.insert(userPasswords).values({
      userId,
      email: email.toLowerCase(),
      passwordHash,
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
