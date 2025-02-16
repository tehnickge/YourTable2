/*
  Warnings:

  - You are about to drop the `WorkShadule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkShadule" DROP CONSTRAINT "WorkShadule_day_fk_fkey";

-- DropForeignKey
ALTER TABLE "WorkShadule" DROP CONSTRAINT "WorkShadule_restaurant_fk_fkey";

-- DropTable
DROP TABLE "WorkShadule";

-- CreateTable
CREATE TABLE "WorkShedule" (
    "id" SERIAL NOT NULL,
    "timeBegin" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,
    "day_fk" INTEGER NOT NULL,

    CONSTRAINT "WorkShedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkShedule" ADD CONSTRAINT "WorkShedule_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkShedule" ADD CONSTRAINT "WorkShedule_day_fk_fkey" FOREIGN KEY ("day_fk") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
