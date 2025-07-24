import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/orders/:id
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

// PATCH /api/orders/:id
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { status } = await req.json();

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedOrder);
}