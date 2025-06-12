/*
  Warnings:

  - You are about to drop the column `rolId` on the `Evaluaciones` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trabajoId,professorId,criterioId]` on the table `Evaluaciones` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `professorId` to the `Evaluaciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Evaluaciones" DROP CONSTRAINT "Evaluaciones_rolId_fkey";

-- AlterTable
ALTER TABLE "Evaluaciones" DROP COLUMN "rolId",
ADD COLUMN     "professorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Evaluaciones_trabajoId_professorId_criterioId_key" ON "Evaluaciones"("trabajoId", "professorId", "criterioId");

-- AddForeignKey
ALTER TABLE "Evaluaciones" ADD CONSTRAINT "Evaluaciones_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
