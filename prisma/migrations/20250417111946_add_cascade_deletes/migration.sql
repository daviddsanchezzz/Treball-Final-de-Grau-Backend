/*
  Warnings:

  - A unique constraint covering the columns `[trabajoId,evaluadorId]` on the table `EvaluacionFinalEvaluador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionFinalEvaluador_trabajoId_evaluadorId_key" ON "EvaluacionFinalEvaluador"("trabajoId", "evaluadorId");
