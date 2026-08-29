import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: thirtyDaysAgo } },
    select: { date: true, amount: true, type: true },
    orderBy: { date: "asc" },
  });

  const byDay = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const key = t.date.toISOString().split("T")[0];
    const entry = byDay.get(key) ?? { income: 0, expense: 0 };

    if (t.type === "INCOME") entry.income += Number(t.amount);
    else entry.expense += Number(t.amount);

    byDay.set(key, entry);
  }

  const data = Array.from(byDay.entries())
    .map(([date, values]) => ({ date, ...values }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json(data);
}