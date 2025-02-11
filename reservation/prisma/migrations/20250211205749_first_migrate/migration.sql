/*
  Warnings:

  - Added the required column `comment` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "rating" DECIMAL(65,30),
ALTER COLUMN "averageBill" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL;
