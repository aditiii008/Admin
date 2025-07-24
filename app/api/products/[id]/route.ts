import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.json();

  const { name, description, price, image, stock } = body;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      image,
      stock: stock ?? 0,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}