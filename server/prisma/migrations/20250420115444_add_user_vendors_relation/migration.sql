/*
  Warnings:

  - Added the required column `userId` to the `ApiVendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiVendor" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ApiVendor_userId_idx" ON "ApiVendor"("userId");

-- AddForeignKey
ALTER TABLE "ApiVendor" ADD CONSTRAINT "ApiVendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
