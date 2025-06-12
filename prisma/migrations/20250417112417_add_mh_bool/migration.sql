/*
  Warnings:

  - Added the required column `matricula` to the `EvaluacionFinalEvaluador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvaluacionFinalEvaluador" DROP COLUMN "matricula",
ADD COLUMN     "matricula" BOOLEAN NOT NULL;
