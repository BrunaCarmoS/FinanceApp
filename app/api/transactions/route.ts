import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTransactionSchema } from "@/lib/validations/transaction";
import { generateDueTransactions } from "@/lib/recurrence-engine";

export async function GET() {
  await generateDueTransactions();

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: { account: true, category: true, goal: true },
  });

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createTransactionSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const created = await tx.transaction.create({ data: result.data });

    const delta = result.data.type === "INCOME" ? result.data.amount : -result.data.amount;

    await tx.account.update({
      where: { id: result.data.accountId },
      data: { balance: { increment: delta } },
    });

    return created;
  });

  return NextResponse.json(transaction, { status: 201 });
}