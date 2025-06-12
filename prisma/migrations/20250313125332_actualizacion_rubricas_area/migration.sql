-- DropForeignKey
ALTER TABLE "UsuarioTrabajoRol" DROP CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey";

-- AlterTable
ALTER TABLE "UsuarioTrabajoRol" ALTER COLUMN "trabajoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UsuarioTrabajoRol" ADD CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
