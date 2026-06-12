import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // Reorder — just update columnId
  if (body.newIndex !== undefined) {
    await prisma.task.update({
      where: { id },
      data: { columnId: body.columnId },
    });
    return NextResponse.json({ success: true });
  }

  // Edit
  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
      ...(body.label !== undefined && { label: body.label }),
      ...(body.columnId !== undefined && { columnId: body.columnId }),
    },
  });

  return NextResponse.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
