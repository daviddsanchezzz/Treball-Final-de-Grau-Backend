-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'FINALIZADO');

-- AlterTable
ALTER TABLE "Trabajo" ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'PENDIENTE';
