/*
  Warnings:

  - The primary key for the `note_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `note_tags` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `note_tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,userId]` on the table `notes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "credentials" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "note_tags" DROP CONSTRAINT "note_tags_pkey",
DROP COLUMN "id",
DROP COLUMN "updated_at",
ADD CONSTRAINT "note_tags_pkey" PRIMARY KEY ("noteId", "tagId");

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "note_tag_noteId_idx" ON "note_tags"("noteId");

-- CreateIndex
CREATE INDEX "note_tag_tagId_idx" ON "note_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "notes_title_userId_key" ON "notes"("title", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_userId_key" ON "tags"("name", "userId");
