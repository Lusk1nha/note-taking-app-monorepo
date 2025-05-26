/*
  Warnings:

  - Added the required column `userId` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `auth_providers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_providers" DROP CONSTRAINT "auth_providers_id_fkey";

-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_id_fkey";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "auth_providers" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_providers" ADD CONSTRAINT "auth_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
