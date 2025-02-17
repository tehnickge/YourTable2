-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recommendations" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
