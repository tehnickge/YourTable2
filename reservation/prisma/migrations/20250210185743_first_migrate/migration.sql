/*
  Warnings:

  - Added the required column `slot_fk` to the `Rent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rent" ADD COLUMN     "slot_fk" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_slot_fk_fkey" FOREIGN KEY ("slot_fk") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
