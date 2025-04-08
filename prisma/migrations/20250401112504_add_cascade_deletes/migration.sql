-- DropForeignKey
ALTER TABLE "Nota" DROP CONSTRAINT "Nota_trabajoId_fkey";

-- DropForeignKey
ALTER TABLE "PuntosDeControl" DROP CONSTRAINT "PuntosDeControl_rubricaId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioTrabajoRol" DROP CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey";

-- AddForeignKey
ALTER TABLE "UsuarioTrabajoRol" ADD CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosDeControl" ADD CONSTRAINT "PuntosDeControl_rubricaId_fkey" FOREIGN KEY ("rubricaId") REFERENCES "Rubricas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
