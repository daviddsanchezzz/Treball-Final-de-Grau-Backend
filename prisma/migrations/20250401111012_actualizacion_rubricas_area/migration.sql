-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Trabajo" DROP CONSTRAINT "Trabajo_tutorId_fkey";

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;
