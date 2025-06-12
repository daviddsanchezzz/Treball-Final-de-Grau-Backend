/*
  Warnings:

  - You are about to drop the column `estudianteId` on the `Trabajo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_estudianteId_fkey";

-- AlterTable
ALTER TABLE "Trabajo" DROP COLUMN "estudianteId",
ADD COLUMN     "estudiante" TEXT NOT NULL DEFAULT 'Estudiante temporal';
