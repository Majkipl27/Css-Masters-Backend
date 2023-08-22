/*
  Warnings:

  - Added the required column `description` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "avatar" BYTEA,
ADD COLUMN     "banner" BYTEA,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT NOT NULL;
