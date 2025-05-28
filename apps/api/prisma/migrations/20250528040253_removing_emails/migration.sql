/*
  Warnings:

  - You are about to drop the `emails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_userId_fkey";

-- DropTable
DROP TABLE "emails";
