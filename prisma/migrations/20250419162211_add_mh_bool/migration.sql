-- DropForeignKey
ALTER TABLE "EvaluacionFinalEvaluador" DROP CONSTRAINT "EvaluacionFinalEvaluador_evaluadorId_fkey";

-- AddForeignKey
ALTER TABLE "EvaluacionFinalEvaluador" ADD CONSTRAINT "EvaluacionFinalEvaluador_evaluadorId_fkey" FOREIGN KEY ("evaluadorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
