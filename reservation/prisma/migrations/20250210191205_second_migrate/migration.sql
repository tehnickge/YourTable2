/*
  Warnings:

  - Added the required column `number` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "number" TEXT NOT NULL;
