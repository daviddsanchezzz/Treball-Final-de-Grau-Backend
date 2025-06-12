/*
  Warnings:

  - You are about to drop the `TrabajoEvaluador` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrabajoEvaluador" DROP CONSTRAINT "TrabajoEvaluador_evaluadorId_fkey";

-- DropForeignKey
ALTER TABLE "TrabajoEvaluador" DROP CONSTRAINT "TrabajoEvaluador_trabajoId_fkey";

-- DropTable
DROP TABLE "TrabajoEvaluador";
