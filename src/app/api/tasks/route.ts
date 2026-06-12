import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const task = await prisma.task.create({
    data: {
      title: body.title,
      columnId: body.columnId,
      priority: body.priority,
      description: body.description ?? "",
      dueDate: body.dueDate ?? "",
      label: body.label ?? "",
      userId,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
