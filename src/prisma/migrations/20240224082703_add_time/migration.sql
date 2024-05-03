/*
  Warnings:

  - Made the column `update_time` on table `Action` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_time` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_time` on table `Workflow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "update_time" SET NOT NULL,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "update_time" SET NOT NULL,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Workflow" ALTER COLUMN "update_time" SET NOT NULL,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;
