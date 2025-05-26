/*
  Warnings:

  - Added the required column `userId` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;
