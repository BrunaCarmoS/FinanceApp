import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTransactionSchema } from "@/lib/validations/transaction";

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: { account: true, category: true },
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

  const transaction = await prisma.transaction.create({
    data: result.data,
  });

  return NextResponse.json(transaction, { status: 201 });
}