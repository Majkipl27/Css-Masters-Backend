/*
  Warnings:

  - Added the required column `colors` to the `Challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenges" ADD COLUMN     "colors" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Playlists" ADD COLUMN     "additionalComment" TEXT,
ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'CSS Masters',
ADD COLUMN     "image" TEXT;
