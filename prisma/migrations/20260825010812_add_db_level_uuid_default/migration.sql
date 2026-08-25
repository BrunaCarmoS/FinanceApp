-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
