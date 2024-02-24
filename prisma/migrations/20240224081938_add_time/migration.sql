-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "started_time" TIMESTAMP(3),
ADD COLUMN     "update_time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "started_time" TIMESTAMP(3),
ADD COLUMN     "update_time" TIMESTAMP(3);
