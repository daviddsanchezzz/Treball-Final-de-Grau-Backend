/*
  Warnings:

  - A unique constraint covering the columns `[trabajoId,puntoControlId]` on the table `EvaluacionFinalTutor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionFinalTutor_trabajoId_puntoControlId_key" ON "EvaluacionFinalTutor"("trabajoId", "puntoControlId");
