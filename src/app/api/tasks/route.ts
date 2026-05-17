import { NextRequest, NextResponse } from "next/server";
import { TaskType } from "@/types/boardTypes";
import { readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ tasks: db.tasks });
}

export async function POST(req: NextRequest) {
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
  };

  db.tasks = [...db.tasks, newTask];
  writeDb(db);

  return NextResponse.json({ task: newTask }, { status: 201 });
}
