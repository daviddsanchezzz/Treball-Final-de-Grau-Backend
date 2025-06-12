-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiracion" INTEGER;
