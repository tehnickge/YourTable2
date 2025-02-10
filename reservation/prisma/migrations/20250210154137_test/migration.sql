/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "RestaurantPhoto" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "photo" BYTEA NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,

    CONSTRAINT "RestaurantPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "unicKey" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,
    "info" TEXT NOT NULL,
    "shortInfo" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantPhoto" ADD CONSTRAINT "RestaurantPhoto_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
