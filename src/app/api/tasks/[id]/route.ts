import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { TaskType } from "@/types/boardTypes"; 

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await req.json();
  const db = readDb();

  const index = db.tasks.findIndex((t: TaskType) => t.id === id); 
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (body.newIndex !== undefined) {
    const columnId = body.columnId;
    const columnTasks = db.tasks.filter(
      (t: TaskType) => t.columnId === columnId,
    ); // ← add
    const otherTasks = db.tasks.filter(
      (t: TaskType) => t.columnId !== columnId,
    ); // ← add
    const oldIndex = columnTasks.findIndex((t: TaskType) => t.id === id); 
    const reordered = [...columnTasks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(body.newIndex, 0, moved);
    db.tasks = [...otherTasks, ...reordered];
  } else {
    db.tasks[index] = { ...db.tasks[index], ...body };
  }

  writeDb(db);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const db = readDb();

  const index = db.tasks.findIndex((t: TaskType) => t.id === id); 
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  db.tasks = db.tasks.filter((t: TaskType) => t.id !== id); 
  writeDb(db);
  return NextResponse.json({ success: true });
}
