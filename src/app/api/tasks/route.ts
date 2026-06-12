import { NextRequest, NextResponse } from "next/server";
import { TaskType } from "@/types/boardTypes";
import { readDb, writeDb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDb();
  const userTasks = db.tasks.filter((t: TaskType) => t.userId === userId);
  return NextResponse.json({ tasks: userTasks });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = readDb();

  const newTask: TaskType = {
    id: crypto.randomUUID(),
    title: body.title,
    columnId: body.columnId,
    priority: body.priority,
    description: body.description ?? "",
    dueDate: body.dueDate ?? "",
    createdAt: new Date().toISOString(),
    label: body.label ?? "",
    userId,
  };

  db.tasks = [...db.tasks, newTask];
  writeDb(db);
  return NextResponse.json({ task: newTask }, { status: 201 });
}
