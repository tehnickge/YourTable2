/*
  Warnings:

  - Changed the type of `timeBegin` on the `WorkShedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timeEnd` on the `WorkShedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "WorkShedule" DROP COLUMN "timeBegin",
ADD COLUMN     "timeBegin" INTEGER NOT NULL,
DROP COLUMN "timeEnd",
ADD COLUMN     "timeEnd" INTEGER NOT NULL;
