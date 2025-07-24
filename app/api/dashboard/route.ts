import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [totalProducts, totalOrders, totalCustomers, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalCustomers,
    recentOrders,
  });
}
