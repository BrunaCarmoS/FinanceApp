import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDueTransactions } from "@/lib/recurrence-engine";

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

async function sumByType(type: "INCOME" | "EXPENSE", from?: Date, to?: Date) {
  const result = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      type,
      ...(from || to ? { date: { gte: from, lte: to } } : {}),
    },
  });
  return result._sum.amount ? Number(result._sum.amount) : 0;
}

export async function GET() {
  await generateDueTransactions();

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [totalIncome, totalExpense, thisMonthIncome, thisMonthExpense, lastMonthIncome, lastMonthExpense] =
    await Promise.all([
      sumByType("INCOME"),
      sumByType("EXPENSE"),
      sumByType("INCOME", startOfThisMonth, now),
      sumByType("EXPENSE", startOfThisMonth, now),
      sumByType("INCOME", startOfLastMonth, endOfLastMonth),
      sumByType("EXPENSE", startOfLastMonth, endOfLastMonth),
    ]);

  const balance = totalIncome - totalExpense;
  const thisMonthNet = thisMonthIncome - thisMonthExpense;
  const lastMonthNet = lastMonthIncome - lastMonthExpense;

  return NextResponse.json({
    totalIncome,
    totalExpense,
    balance,
    changes: {
      balance: percentChange(thisMonthNet, lastMonthNet),
      income: percentChange(thisMonthIncome, lastMonthIncome),
      expense: percentChange(thisMonthExpense, lastMonthExpense),
    },
  });
}