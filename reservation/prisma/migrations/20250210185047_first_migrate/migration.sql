/*
  Warnings:

  - You are about to drop the column `createAt` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `restaurantChain_fk` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "maxHoursToRent" DECIMAL(65,30) NOT NULL DEFAULT 1,
ADD COLUMN     "restaurantChain_fk" INTEGER NOT NULL,
ALTER COLUMN "info" DROP NOT NULL,
ALTER COLUMN "shortInfo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RestaurantPhoto" ALTER COLUMN "photo" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Rent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeStart" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "user_fk" INTEGER NOT NULL,
    "rentStatus" TEXT NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,
    "amountPeople" INTEGER NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" SERIAL NOT NULL,
    "maxCountPeople" INTEGER NOT NULL,
    "zone_fk" INTEGER NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "discription" TEXT,
    "color" TEXT,
    "restaurant_fk" INTEGER NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" BYTEA NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "historyRest" INTEGER[],
    "wishList" INTEGER[],
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,
    "user_fk" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kitchen" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantKitchen" (
    "id" SERIAL NOT NULL,
    "kitchen_fk" INTEGER NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,

    CONSTRAINT "RestaurantKitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkShadule" (
    "id" SERIAL NOT NULL,
    "timeBegin" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,
    "day_fk" INTEGER NOT NULL,

    CONSTRAINT "WorkShadule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "coordinate" TEXT,
    "restaurant_fk" INTEGER NOT NULL,
    "timezone" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "titleDish" TEXT,
    "price" DECIMAL(65,30),
    "restaurant_fk" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantChain" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company_fk" INTEGER NOT NULL,

    CONSTRAINT "RestaurantChain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_title_key" ON "Kitchen"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Address_restaurant_fk_key" ON "Address"("restaurant_fk");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_restaurantChain_fk_fkey" FOREIGN KEY ("restaurantChain_fk") REFERENCES "RestaurantChain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_zone_fk_fkey" FOREIGN KEY ("zone_fk") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantKitchen" ADD CONSTRAINT "RestaurantKitchen_kitchen_fk_fkey" FOREIGN KEY ("kitchen_fk") REFERENCES "Kitchen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantKitchen" ADD CONSTRAINT "RestaurantKitchen_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkShadule" ADD CONSTRAINT "WorkShadule_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkShadule" ADD CONSTRAINT "WorkShadule_day_fk_fkey" FOREIGN KEY ("day_fk") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantChain" ADD CONSTRAINT "RestaurantChain_company_fk_fkey" FOREIGN KEY ("company_fk") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
