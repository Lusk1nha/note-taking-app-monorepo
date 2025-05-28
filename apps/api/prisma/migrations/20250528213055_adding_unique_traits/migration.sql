/*
  Warnings:

  - Added the required column `userId` to the `note_tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note_tags" ADD COLUMN     "userId" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "note_tags" ADD CONSTRAINT "note_tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
