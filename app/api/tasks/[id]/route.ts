import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTask } from "@/lib/ai/task-manager";

// GET /api/tasks/[id] — poll task status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const task = await getTask(id);

    if (!task) {
      return NextResponse.json({ error: "任务不存在" }, { status: 404 });
    }

    if (task.userId !== session.user.id) {
      return NextResponse.json({ error: "无权访问此任务" }, { status: 403 });
    }

    // Convert COS URLs to proxy URLs for private buckets
    if (task.resultUrls) {
      task.resultUrls = task.resultUrls.map((url: string) => {
        if (url.includes('.cos.')) {
          const match = url.match(/myqcloud\.com\/(.+)$/);
          if (match) return `/api/uploads/cos/${match[1]}`;
        }
        return url;
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    return NextResponse.json({ error: "获取任务状态失败" }, { status: 500 });
  }
}