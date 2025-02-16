-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_restaurantChain_fk_fkey";

-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "restaurantChain_fk" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_restaurantChain_fk_fkey" FOREIGN KEY ("restaurantChain_fk") REFERENCES "RestaurantChain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
