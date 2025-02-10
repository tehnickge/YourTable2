/*
  Warnings:

  - You are about to drop the column `discription` on the `Zone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Zone" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;
