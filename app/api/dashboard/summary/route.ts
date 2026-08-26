import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDueTransactions } from "@/lib/recurrence-engine";

export async function GET() {
  await generateDueTransactions();

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    }),
  ]);

  const totalIncome = incomeResult._sum.amount ? Number(incomeResult._sum.amount) : 0;
  const totalExpense = expenseResult._sum.amount ? Number(expenseResult._sum.amount) : 0;
  const balance = totalIncome - totalExpense;

  return NextResponse.json({ totalIncome, totalExpense, balance });
}