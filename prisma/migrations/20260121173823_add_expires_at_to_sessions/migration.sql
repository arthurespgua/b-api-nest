-- AlterTable
ALTER TABLE "Sessions" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '24 hours';
