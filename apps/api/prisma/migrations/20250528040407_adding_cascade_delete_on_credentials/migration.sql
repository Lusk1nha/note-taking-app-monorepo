-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_userId_fkey";

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
