-- DropForeignKey
ALTER TABLE "EvaluacionFinalEvaluador" DROP CONSTRAINT "EvaluacionFinalEvaluador_trabajoId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluacionFinalTutor" DROP CONSTRAINT "EvaluacionFinalTutor_trabajoId_fkey";

-- DropForeignKey
ALTER TABLE "TrabajoEvaluador" DROP CONSTRAINT "TrabajoEvaluador_trabajoId_fkey";

-- AddForeignKey
ALTER TABLE "TrabajoEvaluador" ADD CONSTRAINT "TrabajoEvaluador_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionFinalEvaluador" ADD CONSTRAINT "EvaluacionFinalEvaluador_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionFinalTutor" ADD CONSTRAINT "EvaluacionFinalTutor_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
