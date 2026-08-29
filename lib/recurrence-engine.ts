import { prisma } from "@/lib/prisma";

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

function addPeriod(date: Date, frequency: Frequency): Date {
  const next = new Date(date);

  switch (frequency) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

export async function generateDueTransactions() {
  const today = new Date();

  const recurrences = await prisma.recurrence.findMany({
    where: {
      startDate: { lte: today },
      OR: [{ endDate: null }, { endDate: { gte: today } }],
    },
  });

  for (const recurrence of recurrences) {
    let nextDate = recurrence.lastGeneratedDate
      ? addPeriod(recurrence.lastGeneratedDate, recurrence.frequency)
      : recurrence.startDate;

    let lastCreated: Date | null = null;

        while (
      nextDate <= today &&
      (!recurrence.endDate || nextDate <= recurrence.endDate)
    ) {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            amount: recurrence.amount,
            type: recurrence.type,
            description: recurrence.description ?? undefined,
            date: nextDate,
            accountId: recurrence.accountId,
            categoryId: recurrence.categoryId ?? undefined,
            recurrenceId: recurrence.id,
          },
        });

        const delta = recurrence.type === "INCOME" ? Number(recurrence.amount) : -Number(recurrence.amount);

        await tx.account.update({
          where: { id: recurrence.accountId },
          data: { balance: { increment: delta } },
        });
      });

      lastCreated = nextDate;
      nextDate = addPeriod(nextDate, recurrence.frequency);
    }

    if (lastCreated) {
      await prisma.recurrence.update({
        where: { id: recurrence.id },
        data: { lastGeneratedDate: lastCreated },
      });
    }
  }
}