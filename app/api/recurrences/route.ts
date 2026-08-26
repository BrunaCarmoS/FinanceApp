import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRecurrenceSchema } from "@/lib/validations/recurrence";
import { generateDueTransactions } from "@/lib/recurrence-engine";

export async function GET() {
  await generateDueTransactions();

  const recurrences = await prisma.recurrence.findMany({
    orderBy: { createdAt: "desc" },
    include: { account: true, category: true },
  });

  return NextResponse.json(recurrences);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createRecurrenceSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const recurrence = await prisma.recurrence.create({
    data: result.data,
  });

  return NextResponse.json(recurrence, { status: 201 });
}