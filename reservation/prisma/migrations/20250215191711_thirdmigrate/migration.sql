/*
  Warnings:

  - You are about to drop the column `AverageBill` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "AverageBill",
ALTER COLUMN "averageBill" SET DATA TYPE DECIMAL(65,30);
