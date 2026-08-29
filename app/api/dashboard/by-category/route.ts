import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      transactions: {
        where: { type: "EXPENSE" },
        select: { amount: true },
      },
    },
  });

  const data = categories
    .map((category) => ({
      name: category.name,
      color: category.color ?? "#CCCCCC",
      total: category.transactions.reduce((sum, t) => sum + Number(t.amount), 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return NextResponse.json(data);
}