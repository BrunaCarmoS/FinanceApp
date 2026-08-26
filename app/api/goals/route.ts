import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGoalSchema } from "@/lib/validations/goal";

export async function GET() {
  const goals = await prisma.goal.findMany({
    orderBy: { createdAt: "desc" },
  });

  const goalsWithProgress = await Promise.all(
    goals.map(async (goal) => {
      const result = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          goalId: goal.id,
          type: "EXPENSE",
        },
      });

      const currentAmount = result._sum.amount ? Number(result._sum.amount) : 0;

      return { ...goal, currentAmount };
    })
  );

  return NextResponse.json(goalsWithProgress);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createGoalSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const goal = await prisma.goal.create({
    data: result.data,
  });

  return NextResponse.json(goal, { status: 201 });
}