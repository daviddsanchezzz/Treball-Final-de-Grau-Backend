const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una nueva nota para un trabajo, profesor y criterio-punto de control
const crearNota = async (req, res) => {
  const { trabajoId, profesorId, criterioPuntoControlId, nota } = req.body;

  try {
    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
      return res.status(400).json({ error: 'La nota debe ser un número entre 0 y 10' });
    }

    const trabajo = await prisma.trabajo.findUnique({ where: { id: trabajoId } });
    if (!trabajo) return res.status(404).json({ error: 'Trabajo no encontrado' });

    const profesor = await prisma.usuario.findUnique({ where: { id: profesorId } });
    if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado' });

    const criterioPuntoControl = await prisma.criterioPuntoControl.findUnique({ where: { id: criterioPuntoControlId } });
    if (!criterioPuntoControl) return res.status(404).json({ error: 'Criterio-Punto de control no encontrado' });

    const nuevaNota = await prisma.nota.create({
      data: {
        nota,
        trabajo: { connect: { id: trabajoId } },
        profesor: { connect: { id: profesorId } },
        criterioPuntoControl: { connect: { id: criterioPuntoControlId } },
      },
    });

    res.status(201).json(nuevaNota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la nota', detalles: error.message });
  }
};


// Crear o actualizar evaluación final del evaluador
async function crearActualizarEvaluacionFinalEvaluador(req, res) {
  const { trabajoId, evaluadorId, observaciones, matricula, notaFinal } = req.body;

  try {
    // Comprobamos si ya existe una evaluación para ese trabajo y evaluador
    const evaluacionExistente = await prisma.evaluacionFinalEvaluador.findUnique({
      where: {
        trabajoId_evaluadorId: {
          trabajoId,
          evaluadorId
        }
      }
    });

    if (evaluacionExistente) {
      // Si existe, actualizamos la evaluación
      const evaluacionActualizada = await prisma.evaluacionFinalEvaluador.update({
        where: {
          id: evaluacionExistente.id
        },
        data: {
          observaciones,
          matricula,
          notaFinal
        }
      });
      return res.json(evaluacionActualizada);
    } else {
      // Si no existe, la creamos
      const nuevaEvaluacion = await prisma.evaluacionFinalEvaluador.create({
        data: {
          trabajoId,
          evaluadorId,
          observaciones,
          matricula,
          notaFinal
        }
      });
      return res.status(201).json(nuevaEvaluacion);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Crear o actualizar evaluación final del tutor
async function crearActualizarEvaluacionFinalTutor(req, res) {
  const { trabajoId, puntoControlId, notaFinalPC, observacionPC } = req.body;

  try {
    // Comprobamos si ya existe una evaluación final para ese trabajo y punto de control
    const evaluacionExistente = await prisma.evaluacionFinalTutor.findUnique({
      where: {
        trabajoId_puntoControlId: {
          trabajoId,
          puntoControlId
        }
      }
    });

    if (evaluacionExistente) {
      // Si existe, actualizamos la evaluación
      const evaluacionActualizada = await prisma.evaluacionFinalTutor.update({
        where: {
          id: evaluacionExistente.id
        },
        data: {
          notaFinalPC,
          observacionPC
        }
      });
      return res.json(evaluacionActualizada);
    } else {
      // Si no existe, la creamos
      const nuevaEvaluacion = await prisma.evaluacionFinalTutor.create({
        data: {
          trabajoId,
          puntoControlId,
          notaFinalPC,
          observacionPC
        }
      });
      return res.status(201).json(nuevaEvaluacion);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// controlador/evaluacionFinalEvaluadorController.js

async function obtenerEvaluacionFinalEvaluador(req, res) {
    const { trabajoId, evaluadorId } = req.params;
  
    try {
      const evaluacion = await prisma.evaluacionFinalEvaluador.findUnique({
        where: {
          trabajoId_evaluadorId: {
            trabajoId: parseInt(trabajoId),
            evaluadorId: parseInt(evaluadorId)
          }
        }
      });
  
      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }
  
      return res.json(evaluacion);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  

async function obtenerEvaluacionFinalTutor(req, res) {
    const { trabajoId, puntoControlId } = req.params;
  
    try {
      const evaluacion = await prisma.evaluacionFinalTutor.findUnique({
        where: {
          trabajoId_puntoControlId: {
            trabajoId: parseInt(trabajoId),
            puntoControlId: parseInt(puntoControlId)
          }
        }
      });
  
      if (!evaluacion) {
        return res.status(404).json({ error: "Evaluación no encontrada" });
      }
  
      return res.json(evaluacion);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
    

module.exports = { 
    crearNota, 
    crearActualizarEvaluacionFinalEvaluador, 
    crearActualizarEvaluacionFinalTutor,
    obtenerEvaluacionFinalEvaluador,
    obtenerEvaluacionFinalTutor
};
