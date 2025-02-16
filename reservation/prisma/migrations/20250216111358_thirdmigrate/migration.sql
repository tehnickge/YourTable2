/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_title_key" ON "Company"("title");
