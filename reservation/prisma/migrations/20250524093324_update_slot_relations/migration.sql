-- DropForeignKey
ALTER TABLE "Rent" DROP CONSTRAINT "Rent_slot_fk_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_zone_fk_fkey";

-- AlterTable
ALTER TABLE "Rent" ALTER COLUMN "slot_fk" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_slot_fk_fkey" FOREIGN KEY ("slot_fk") REFERENCES "Slot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_zone_fk_fkey" FOREIGN KEY ("zone_fk") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
