/*
  Warnings:

  - You are about to drop the column `currentAmount` on the `goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "goals" DROP COLUMN "currentAmount";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "goalId" UUID;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
