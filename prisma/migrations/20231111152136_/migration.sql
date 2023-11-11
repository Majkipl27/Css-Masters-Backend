/*
  Warnings:

  - You are about to drop the column `image` on the `Badges` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Badges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Badges" DROP COLUMN "image",
ADD COLUMN     "imageId" INTEGER NOT NULL;
