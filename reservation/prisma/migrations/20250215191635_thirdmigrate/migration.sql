/*
  Warnings:

  - Added the required column `AverageBill` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "AverageBill" DECIMAL(65,30) NOT NULL;
