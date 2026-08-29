import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTransactionSchema } from "@/lib/validations/transaction";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = updateTransactionSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findUniqueOrThrow({ where: { id } });

    // desfaz o efeito antigo no saldo da conta original
    const oldDelta = existing.type === "INCOME" ? -Number(existing.amount) : Number(existing.amount);
    await tx.account.update({
      where: { id: existing.accountId },
      data: { balance: { increment: oldDelta } },
    });

    const merged = {
      amount: result.data.amount ?? Number(existing.amount),
      type: result.data.type ?? existing.type,
      accountId: result.data.accountId ?? existing.accountId,
      categoryId: result.data.categoryId !== undefined ? result.data.categoryId : existing.categoryId,
      goalId: result.data.goalId !== undefined ? result.data.goalId : existing.goalId,
      description: result.data.description !== undefined ? result.data.description : existing.description,
      date: result.data.date ?? existing.date,
    };

    const updatedTransaction = await tx.transaction.update({
      where: { id },
      data: merged,
    });

    // aplica o novo efeito na conta (pode ser outra conta, se ela mudou)
    const newDelta = merged.type === "INCOME" ? merged.amount : -merged.amount;
    await tx.account.update({
      where: { id: merged.accountId },
      data: { balance: { increment: newDelta } },
    });

    return updatedTransaction;
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUniqueOrThrow({ where: { id } });

    const delta = transaction.type === "INCOME" ? -Number(transaction.amount) : Number(transaction.amount);

    await tx.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: delta } },
    });

    await tx.transaction.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}