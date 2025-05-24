/*
  Warnings:

  - Added the required column `status` to the `emails` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "email_status" AS ENUM ('SENT', 'FAILED', 'PENDING');

-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "status" "email_status" NOT NULL;
