import { db } from "@/lib/db";
import { generationTasks } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export type TaskStatus = "pending" | "processing" | "completed" | "failed";

export interface TaskInfo {
  id: string;
  status: TaskStatus;
  provider?: string | null;
  resultUrls?: string[] | null;
  error?: string | null;
  createdAt: Date;
}

export async function createTask(params: {
  userId: string;
  provider: string;
  prompt: string;
  styleId: string;
  styleStrength: number;
  size?: string;
  count?: number;
}): Promise<string> {
  const id = crypto.randomUUID();
  await db.insert(generationTasks).values({
    id,
    userId: params.userId,
    status: "pending",
    provider: params.provider,
    prompt: params.prompt,
    styleId: params.styleId,
    styleStrength: params.styleStrength,
    size: params.size || "1024x1024",
    count: params.count || 1,
  });
  return id;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  extra?: { resultUrls?: string[]; error?: string }
): Promise<void> {
  await db
    .update(generationTasks)
    .set({
      status,
      ...(extra?.resultUrls ? { resultUrls: JSON.stringify(extra.resultUrls) } : {}),
      ...(extra?.error ? { error: extra.error } : {}),
      updatedAt: new Date(),
    })
    .where(eq(generationTasks.id, taskId));
}

export async function getTask(taskId: string): Promise<TaskInfo | null> {
  const rows = await db
    .select()
    .from(generationTasks)
    .where(eq(generationTasks.id, taskId))
    .limit(1);

  if (!rows.length) return null;

  const row = rows[0];
  return {
    id: row.id,
    status: row.status as TaskStatus,
    provider: row.provider,
    resultUrls: row.resultUrls ? JSON.parse(row.resultUrls) : null,
    error: row.error,
    createdAt: row.createdAt,
  };
}

export async function getUserTasks(userId: string, limit: number = 20): Promise<TaskInfo[]> {
  const rows = await db
    .select()
    .from(generationTasks)
    .where(eq(generationTasks.userId, userId))
    .orderBy(desc(generationTasks.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    status: row.status as TaskStatus,
    provider: row.provider,
    resultUrls: row.resultUrls ? JSON.parse(row.resultUrls) : null,
    error: row.error,
    createdAt: row.createdAt,
  }));
}