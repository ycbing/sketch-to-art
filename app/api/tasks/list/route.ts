import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserTasks } from "@/lib/ai/task-manager";

// GET /api/tasks/list — list user's recent tasks
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const tasks = await getUserTasks(session.user.id, 20);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("List tasks error:", error);
    return NextResponse.json({ error: "获取任务列表失败" }, { status: 500 });
  }
}