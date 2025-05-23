-- CreateTable
CREATE TABLE "Hostes" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "restaurant_fk" INTEGER NOT NULL,

    CONSTRAINT "Hostes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hostes_login_key" ON "Hostes"("login");

-- AddForeignKey
ALTER TABLE "Hostes" ADD CONSTRAINT "Hostes_restaurant_fk_fkey" FOREIGN KEY ("restaurant_fk") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
