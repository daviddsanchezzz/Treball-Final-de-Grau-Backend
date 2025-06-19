// Importem PrismaClient per poder interactuar amb la base de dades
const { PrismaClient } = require('@prisma/client');
// Creem una instància de PrismaClient
const prisma = new PrismaClient();

// Funció per crear o actualitzar una nota donada per un avaluador
async function crearNotaEvaluador(req, res) {
  // Obtenim les dades del cos de la petició
  const { criterioId, profesorId, trabajoId, nota } = req.body;

  try {
    // Busquem el registre de la relació Criterio-PuntoDeControl (CPC) que coincideixi amb el criterioId
    const cpc = await prisma.criterioPuntoDeControl.findFirst({
      where: { criterioId }
    });

    // Si no existeix aquesta relació, retornem error 404
    if (!cpc) {
      return res.status(404).json({ error: 'No s\'ha trobat un criterioPuntoDeControl amb aquest criterioId' });
    }

    // Comprovem si ja existeix una nota per aquest treball, professor i CPC
    const notaExistente = await prisma.nota.findFirst({
      where: {
        trabajoId,
        profesorId,
        cpcId: cpc.id
      }
    });

    if (notaExistente) {
      // Si la nota ja existeix, l'actualitzem amb la nova nota
      const notaActualizada = await prisma.nota.update({
        where: { id: notaExistente.id },
        data: { nota }
      });
      // Retornem la nota actualitzada
      return res.status(200).json(notaActualizada);
    } else {
      // Si no existeix, creem una nova nota amb les dades proporcionades
      const nuevaNota = await prisma.nota.create({
        data: {
          nota,
          trabajoId,
          profesorId,
          cpcId: cpc.id
        }
      });
      // Retornem la nota creada amb l'estat 201 (creat)
      return res.status(201).json(nuevaNota);
    }
  } catch (error) {
    // En cas d'error, el loguegem i retornem error 500
    console.error(error);
    return res.status(500).json({ error: 'S\'ha produït un error en guardar la nota' });
  }
}

// Funció per crear o actualitzar una nota donada pel tutor
async function crearNotaTutor(req, res) {
  const { criterioId, puntoControlId, profesorId, trabajoId, nota } = req.body;

  try {
    // Busquem la relació Criterio-PuntoDeControl que coincideixi amb criteri i punt de control
    const cpc = await prisma.criterioPuntoDeControl.findFirst({
      where: {
        criterioId: parseInt(criterioId),
        puntoControlId: parseInt(puntoControlId)
      }
    });

    // Si no existeix aquesta relació, retornem error 404
    if (!cpc) {
      return res.status(404).json({ error: 'No s\'ha trobat la relació criteri-punt de control' });
    }

    // Comprovem si ja existeix una nota per aquest treball, professor i CPC
    const notaExistente = await prisma.nota.findFirst({
      where: {
        trabajoId: parseInt(trabajoId),
        profesorId: parseInt(profesorId),
        cpcId: cpc.id
      }
    });

    if (notaExistente) {
      // Si existeix, actualitzem la nota existent amb la nova nota convertida a float
      const notaActualizada = await prisma.nota.update({
        where: { id: notaExistente.id },
        data: { nota: parseFloat(nota) }
      });
      return res.status(200).json(notaActualizada);
    } else {
      // Si no existeix, creem una nova nota amb les dades proporcionades
      const nuevaNota = await prisma.nota.create({
        data: {
          nota: parseFloat(nota),
          trabajoId: parseInt(trabajoId),
          profesorId: parseInt(profesorId),
          cpcId: cpc.id
        }
      });
      return res.status(201).json(nuevaNota);
    }
  } catch (error) {
    console.error('Error en crear o actualitzar la nota del tutor:', error);
    return res.status(500).json({ error: 'S\'ha produït un error en guardar la nota del tutor' });
  }
}

// Funció per crear o actualitzar l'avaluació final feta per un avaluador
async function crearActualizarEvaluacionFinalEvaluador(req, res) {
  const { trabajoId, evaluadorId, observaciones, matricula, notaFinal } = req.body;

  // Verifiquem que l'avaluador existeix a la base de dades
  const evaluador = await prisma.usuario.findUnique({
    where: { id: evaluadorId },
  });

  if (!evaluador) {
    return res.status(404).json({ error: 'Avaluador no trobat' });
  }

  // Verifiquem que el treball existeix
  const trabajo = await prisma.trabajo.findUnique({
    where: { id: trabajoId },
  });

  if (!trabajo) {
    return res.status(404).json({ error: 'Treball no trobat' });
  }

  try {
    // Busquem si ja existeix una avaluació final per aquest treball i avaluador
    const evaluacionExistente = await prisma.evaluacionFinalEvaluador.findFirst({
      where: {
        AND: [
          { trabajoId: trabajoId },
          { evaluadorId: evaluadorId }
        ]
      }
    });

    if (evaluacionExistente) {
      // Si existeix, actualitzem la avaluació amb les noves dades
      const evaluacionActualizada = await prisma.evaluacionFinalEvaluador.update({
        where: { id: evaluacionExistente.id },
        data: {
          observaciones,
          matricula,
          notaFinal
        }
      });
      return res.json({
        message: 'Avaluació final actualitzada correctament',
        evaluacion: evaluacionActualizada
      });
    } else {
      // Si no existeix, creem una nova avaluació final
      const nuevaEvaluacion = await prisma.evaluacionFinalEvaluador.create({
        data: {
          trabajoId,
          evaluadorId,
          observaciones,
          matricula,
          notaFinal
        }
      });
      return res.status(201).json({
        message: 'Avaluació final creada correctament',
        evaluacion: nuevaEvaluacion
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'S\'ha produït un error en processar l\'avaluació' });
  }
}

// Funció per crear o actualitzar l'avaluació final feta pel tutor
async function crearActualizarEvaluacionFinalTutor(req, res) {
  const { trabajoId, puntoControlId, notaFinalPC, observacionPC } = req.body;

  try {
    // Busquem si ja existeix una avaluació final del tutor per aquest treball i punt de control
    const evaluacionExistente = await prisma.evaluacionFinalTutor.findFirst({
      where: {
        trabajoId,
        puntoControlId
      }
    });

    if (evaluacionExistente) {
      // Si existeix, l'actualitzem amb la nota i observació noves
      const evaluacionActualizada = await prisma.evaluacionFinalTutor.update({
        where: {
          // Clau composta per treball i punt de control
          trabajoId_puntoControlId: {
            trabajoId,
            puntoControlId
          }
        },
        data: {
          notaFinalPC: parseFloat(notaFinalPC),
          observacionPC
        }
      });

      return res.json(evaluacionActualizada);
    } else {
      // Si no existeix, creem una nova avaluació final del tutor
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

// Funció per obtenir l'avaluació final d'un avaluador per un treball concret
async function obtenerEvaluacionFinalEvaluador(req, res) {
  const { trabajoId, evaluadorId } = req.params;

  try {
    // Busquem l'avaluació final per la combinació treball-avaluador
    let evaluacion = await prisma.evaluacionFinalEvaluador.findUnique({
      where: {
        trabajoId_evaluadorId: {
          trabajoId: parseInt(trabajoId),
          evaluadorId: parseInt(evaluadorId)
        }
      },
    });

    // Si no existeix l'avaluació, la creem
    if (!evaluacion) {
      evaluacion = await prisma.evaluacionFinalEvaluador.create({
        data: {
          trabajoId: parseInt(trabajoId),
          evaluadorId: parseInt(evaluadorId),
        }
      });
    }

    // Obtenim totes les notes associades a aquest treball i avaluador
    const notas = await prisma.nota.findMany({
      where: {
        trabajoId: parseInt(trabajoId),
        profesorId: parseInt(evaluadorId)
      },
      include: {
        cpc: {
          include: {
            criterio: true,
            puntoDeControl: true
          }
        }
      }
    });

    // Retornem l'avaluació i les notes associades
    return res.json({ evaluacion, notas });
  } catch (error) {
    console.error('Error al obtener evaluación final evaluador:', error);
    return res.status(500).json({ error: 'Error al obtener evaluación final evaluador' });
  }
}

// Funció per obtenir l'avaluació final del tutor per un treball i punt de control
async function obtenerEvaluacionFinalTutor(req, res) {
  const { trabajoId, puntoControlId } = req.params;

  try {
    // Busquem l'avaluació final del tutor
    const evaluacionFinalTutor = await prisma.evaluacionFinalTutor.findUnique({
      where: {
        trabajoId_puntoControlId: {
          trabajoId: parseInt(trabajoId),
          puntoControlId: parseInt(puntoControlId)
        }
      }
    });

    // Si no existeix, retornem 404
    if (!evaluacionFinalTutor) {
      return res.status(404).json({ error: 'No s\'ha trobat l\'avaluació final del tutor' });
    }

    // Obtenim les notes associades a aquest treball, punt de control i professor (tutor)
    const notas = await prisma.nota.findMany({
      where: {
        trabajoId: parseInt(trabajoId),
        cpc: {
          puntoControlId: parseInt(puntoControlId)
        }
      },
      include: {
        cpc: {
          include: {
            criterio: true,
            puntoDeControl: true
          }
        }
      }
    });

    // Retornem l'avaluació i les notes
    return res.json({ evaluacionFinalTutor, notas });
  } catch (error) {
    console.error('Error al obtener evaluación final tutor:', error);
    return res.status(500).json({ error: 'Error al obtener evaluación final tutor' });
  }
}

module.exports = {
  crearNotaEvaluador,
  crearNotaTutor,
  crearActualizarEvaluacionFinalEvaluador,
  crearActualizarEvaluacionFinalTutor,
  obtenerEvaluacionFinalEvaluador,
  obtenerEvaluacionFinalTutor,
};
