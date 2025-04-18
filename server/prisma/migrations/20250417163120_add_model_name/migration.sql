/*
  Warnings:

  - Added the required column `modelName` to the `ApiVendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiVendor" ADD COLUMN     "modelName" TEXT NOT NULL;
