/*
  Warnings:

  - You are about to drop the `RestaurantPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RestaurantPhoto" DROP CONSTRAINT "RestaurantPhoto_restaurant_fk_fkey";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "photo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photo" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "RestaurantPhoto";
