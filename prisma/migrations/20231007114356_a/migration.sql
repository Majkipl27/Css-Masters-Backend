/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Scores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scores" DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
