/*
  Warnings:

  - A unique constraint covering the columns `[trabajoId,profesorId,cpcId]` on the table `Nota` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nota_trabajoId_profesorId_cpcId_key" ON "Nota"("trabajoId", "profesorId", "cpcId");
