import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, price, image, stock } = body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      image,
      stock: stock ?? 0, // Default to 0 if not provided
    },
  });

  return NextResponse.json(product);
}
