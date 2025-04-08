/*
  Warnings:

  - You are about to drop the column `mereceMatricula` on the `EvaluacionFinalEvaluador` table. All the data in the column will be lost.
  - You are about to drop the column `observacion` on the `EvaluacionFinalEvaluador` table. All the data in the column will be lost.
  - You are about to alter the column `notaFinal` on the `EvaluacionFinalEvaluador` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `notaFinalPC` on the `EvaluacionFinalTutor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `peso` on the `PuntosDeControl` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `notaFinalTrabajo` on the `Trabajo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `notaFinalTutor` on the `Trabajo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `notaMediaEvaluadores` on the `Trabajo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the `Evaluaciones` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `rubricaId` on table `Criterios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rubricaId` on table `PuntosDeControl` required. This step will fail if there are existing NULL values in that column.
  - Made the column `peso` on table `PuntosDeControl` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estudianteId` on table `Trabajo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tutorId` on table `Trabajo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `areaId` on table `Trabajo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trabajoId` on table `UsuarioTrabajoRol` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Criterios" DROP CONSTRAINT "Criterios_rubricaId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluaciones" DROP CONSTRAINT "Evaluaciones_criterioId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluaciones" DROP CONSTRAINT "Evaluaciones_professorId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluaciones" DROP CONSTRAINT "Evaluaciones_puntoControlId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluaciones" DROP CONSTRAINT "Evaluaciones_trabajoId_fkey";

-- DropForeignKey
ALTER TABLE "PuntosDeControl" DROP CONSTRAINT "PuntosDeControl_rubricaId_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioTrabajoRol" DROP CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey";

-- DropIndex
DROP INDEX "EvaluacionFinalEvaluador_trabajoId_evaluadorId_key";

-- DropIndex
DROP INDEX "EvaluacionFinalTutor_trabajoId_puntoControlId_key";

-- DropIndex
DROP INDEX "Roles_nombre_key";

-- DropIndex
DROP INDEX "UsuarioTrabajoRol_usuarioId_trabajoId_key";

-- AlterTable
ALTER TABLE "Criterios" ALTER COLUMN "rubricaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "EvaluacionFinalEvaluador" DROP COLUMN "mereceMatricula",
DROP COLUMN "observacion",
ADD COLUMN     "matricula" TEXT,
ADD COLUMN     "observaciones" TEXT,
ALTER COLUMN "notaFinal" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "EvaluacionFinalTutor" ALTER COLUMN "notaFinalPC" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PuntosDeControl" ALTER COLUMN "rubricaId" SET NOT NULL,
ALTER COLUMN "peso" SET NOT NULL,
ALTER COLUMN "peso" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Trabajo" ALTER COLUMN "estudianteId" SET NOT NULL,
ALTER COLUMN "tutorId" SET NOT NULL,
ALTER COLUMN "areaId" SET NOT NULL,
ALTER COLUMN "notaFinalTrabajo" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "notaFinalTutor" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "notaMediaEvaluadores" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UsuarioTrabajoRol" ALTER COLUMN "trabajoId" SET NOT NULL;

-- DropTable
DROP TABLE "Evaluaciones";

-- CreateTable
CREATE TABLE "CriterioPuntoDeControl" (
    "id" SERIAL NOT NULL,
    "criterioId" INTEGER NOT NULL,
    "puntoControlId" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CriterioPuntoDeControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" SERIAL NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "profesorId" INTEGER NOT NULL,
    "cpcId" INTEGER NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsuarioTrabajoRol" ADD CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosDeControl" ADD CONSTRAINT "PuntosDeControl_rubricaId_fkey" FOREIGN KEY ("rubricaId") REFERENCES "Rubricas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterios" ADD CONSTRAINT "Criterios_rubricaId_fkey" FOREIGN KEY ("rubricaId") REFERENCES "Rubricas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriterioPuntoDeControl" ADD CONSTRAINT "CriterioPuntoDeControl_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriterioPuntoDeControl" ADD CONSTRAINT "CriterioPuntoDeControl_puntoControlId_fkey" FOREIGN KEY ("puntoControlId") REFERENCES "PuntosDeControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_cpcId_fkey" FOREIGN KEY ("cpcId") REFERENCES "CriterioPuntoDeControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
