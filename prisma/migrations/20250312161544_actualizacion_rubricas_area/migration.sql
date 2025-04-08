-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estudianteId" INTEGER,
    "tutorId" INTEGER,
    "areaId" INTEGER,

    CONSTRAINT "Trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioTrabajoRol" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioTrabajoRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubricas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Rubricas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaRubrica" (
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,
    "rubricaId" INTEGER NOT NULL,

    CONSTRAINT "AreaRubrica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntosDeControl" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rubricaId" INTEGER,
    "peso" DECIMAL(65,30),

    CONSTRAINT "PuntosDeControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criterios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rubricaId" INTEGER,

    CONSTRAINT "Criterios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrabajoEvaluador" (
    "id" SERIAL NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "evaluadorId" INTEGER NOT NULL,

    CONSTRAINT "TrabajoEvaluador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluaciones" (
    "id" SERIAL NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "criterioId" INTEGER NOT NULL,
    "puntoControlId" INTEGER,
    "peso" DECIMAL(65,30),
    "nota" DECIMAL(65,30),
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Evaluaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionFinalEvaluador" (
    "id" SERIAL NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "evaluadorId" INTEGER NOT NULL,
    "observacion" TEXT,
    "mereceMatricula" BOOLEAN,
    "notaFinal" DECIMAL(65,30),

    CONSTRAINT "EvaluacionFinalEvaluador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluacionFinalTutor" (
    "id" SERIAL NOT NULL,
    "trabajoId" INTEGER NOT NULL,
    "puntoControlId" INTEGER NOT NULL,
    "notaFinalPC" DECIMAL(65,30),
    "observacionPC" TEXT,

    CONSTRAINT "EvaluacionFinalTutor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roles_nombre_key" ON "Roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioTrabajoRol_usuarioId_trabajoId_key" ON "UsuarioTrabajoRol"("usuarioId", "trabajoId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionFinalEvaluador_trabajoId_evaluadorId_key" ON "EvaluacionFinalEvaluador"("trabajoId", "evaluadorId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluacionFinalTutor_trabajoId_puntoControlId_key" ON "EvaluacionFinalTutor"("trabajoId", "puntoControlId");

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabajo" ADD CONSTRAINT "Trabajo_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioTrabajoRol" ADD CONSTRAINT "UsuarioTrabajoRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioTrabajoRol" ADD CONSTRAINT "UsuarioTrabajoRol_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioTrabajoRol" ADD CONSTRAINT "UsuarioTrabajoRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rubricas" ADD CONSTRAINT "Rubricas_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaRubrica" ADD CONSTRAINT "AreaRubrica_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaRubrica" ADD CONSTRAINT "AreaRubrica_rubricaId_fkey" FOREIGN KEY ("rubricaId") REFERENCES "Rubricas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntosDeControl" ADD CONSTRAINT "PuntosDeControl_rubricaId_fkey" FOREIGN KEY ("rubricaId") REFERENCES "Rubricas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterios" ADD CONSTRAINT "Criterios_rubricaId_fkey" FOREIGN KEY ("rubricaId") REFERENCES "Rubricas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabajoEvaluador" ADD CONSTRAINT "TrabajoEvaluador_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabajoEvaluador" ADD CONSTRAINT "TrabajoEvaluador_evaluadorId_fkey" FOREIGN KEY ("evaluadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluaciones" ADD CONSTRAINT "Evaluaciones_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluaciones" ADD CONSTRAINT "Evaluaciones_criterioId_fkey" FOREIGN KEY ("criterioId") REFERENCES "Criterios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluaciones" ADD CONSTRAINT "Evaluaciones_puntoControlId_fkey" FOREIGN KEY ("puntoControlId") REFERENCES "PuntosDeControl"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluaciones" ADD CONSTRAINT "Evaluaciones_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionFinalEvaluador" ADD CONSTRAINT "EvaluacionFinalEvaluador_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionFinalEvaluador" ADD CONSTRAINT "EvaluacionFinalEvaluador_evaluadorId_fkey" FOREIGN KEY ("evaluadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionFinalTutor" ADD CONSTRAINT "EvaluacionFinalTutor_trabajoId_fkey" FOREIGN KEY ("trabajoId") REFERENCES "Trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluacionFinalTutor" ADD CONSTRAINT "EvaluacionFinalTutor_puntoControlId_fkey" FOREIGN KEY ("puntoControlId") REFERENCES "PuntosDeControl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
