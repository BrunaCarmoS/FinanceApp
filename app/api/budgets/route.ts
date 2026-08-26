import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBudgetSchema } from "@/lib/validations/budget";

export async function GET() {
  const budgets = await prisma.budget.findMany({
    orderBy: { startDate: "desc" },
    include: { category: true },
  });

  const budgetsWithProgress = await Promise.all(
    budgets.map(async (budget) => {
      const result = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          categoryId: budget.categoryId,
          type: "EXPENSE",
          date: { gte: budget.startDate, lte: budget.endDate },
        },
      });

      const spent = result._sum.amount ? Number(result._sum.amount) : 0;

      return { ...budget, spent };
    })
  );

  return NextResponse.json(budgetsWithProgress);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createBudgetSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const budget = await prisma.budget.create({
    data: result.data,
  });

  return NextResponse.json(budget, { status: 201 });
}