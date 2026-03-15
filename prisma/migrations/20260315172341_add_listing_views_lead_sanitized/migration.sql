-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "sanitized" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
