const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function crearNotaEvaluador(req, res) {
  const { criterioId, profesorId, trabajoId, nota } = req.body;

  try {
    // Buscar el CPC (CriterioPuntoDeControl) asociado al criterio
    const cpc = await prisma.criterioPuntoDeControl.findFirst({
      where: { criterioId }
    });

    if (!cpc) {
      return res.status(404).json({ error: 'No se encontró un criterioPuntoDeControl con ese criterioId' });
    }

    // Verificar si ya existe una nota para este trabajo, profesor y CPC
    const notaExistente = await prisma.nota.findFirst({
      where: {
        trabajoId,
        profesorId,
        cpcId: cpc.id
      }
    });

    if (notaExistente) {
      // Si ya existe, la actualizamos
      const notaActualizada = await prisma.nota.update({
        where: { id: notaExistente.id },
        data: { nota }
      });
      return res.status(200).json(notaActualizada);
    } else {
      // Si no existe, la creamos
      const nuevaNota = await prisma.nota.create({
        data: {
          nota,
          trabajoId,
          profesorId,
          cpcId: cpc.id
        }
      });
      return res.status(201).json(nuevaNota);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocurrió un error al guardar la nota' });
  }
}

async function crearNotaTutor(req, res) {
  const { criterioId, puntoControlId, profesorId, trabajoId, nota } = req.body;

  try {
      const cpc = await prisma.criterioPuntoDeControl.findFirst({
        where: {
          criterioId: parseInt(criterioId),
          puntoControlId: parseInt(puntoControlId)
        }
      });
  
      if (!cpc) {
        return res.status(404).json({ error: 'No se encontró la relación criterio-punto de control' });
      }
  
  
      // Verificar si ya existe una nota para este trabajo, profesor y CPC
      const notaExistente = await prisma.nota.findFirst({
        where: {
          trabajoId: parseInt(trabajoId),
          profesorId: parseInt(profesorId),
          cpcId: cpc.id
        }
      });
  
      if (notaExistente) {
        // Actualizar nota existente
        const notaActualizada = await prisma.nota.update({
          where: { id: notaExistente.id },
          data: { nota: parseFloat(nota) }
        });
        return res.status(200).json(notaActualizada);
      } else {
        // Crear nueva nota
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
    console.error('Error al crear o actualizar la nota del tutor:', error);
    return res.status(500).json({ error: 'Ocurrió un error al guardar la nota del tutor' });
  }
}



async function crearActualizarEvaluacionFinalEvaluador(req, res) {
  const { trabajoId, evaluadorId, observaciones, matricula, notaFinal } = req.body;

  // Verificar que el evaluador existe
  const evaluador = await prisma.usuario.findUnique({
    where: { id: evaluadorId },
  });

  if (!evaluador) {
    return res.status(404).json({ error: 'Evaluador no encontrado' });
  }

  // Verificar que el trabajo existe
  const trabajo = await prisma.trabajo.findUnique({
    where: { id: trabajoId },
  });

  if (!trabajo) {
    return res.status(404).json({ error: 'Trabajo no encontrado' });
  }

  try {
    // Comprobamos si ya existe una evaluación para ese trabajo y evaluador
    const evaluacionExistente = await prisma.evaluacionFinalEvaluador.findFirst({
      where: {
        AND: [
          { trabajoId: trabajoId },
          { evaluadorId: evaluadorId }
        ]
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
      return res.json({
        message: 'Evaluación final actualizada correctamente',
        evaluacion: evaluacionActualizada
      });
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
      return res.status(201).json({
        message: 'Evaluación final creada correctamente',
        evaluacion: nuevaEvaluacion
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la evaluación' });
  }
}


// Crear o actualizar evaluación final del tutor
async function crearActualizarEvaluacionFinalTutor(req, res) {
  const { trabajoId, puntoControlId, notaFinalPC, observacionPC } = req.body;

  try {


    // Comprobamos si ya existe una evaluación final para ese trabajo y punto de control
    const evaluacionExistente = await prisma.evaluacionFinalTutor.findFirst({
      where: {
        trabajoId,
        puntoControlId
      }
    });
    


    if (evaluacionExistente) {
      const evaluacionActualizada = await prisma.evaluacionFinalTutor.update({
        where: {
          // Usa la combinación de trabajoId y puntoControlId para identificar el registro
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
    // Intentamos obtener la evaluación
    let evaluacion = await prisma.evaluacionFinalEvaluador.findUnique({
      where: {
        trabajoId_evaluadorId: {
          trabajoId: parseInt(trabajoId),
          evaluadorId: parseInt(evaluadorId)
        }
      },
    });

    // Si no existe, la creamos
    if (!evaluacion) {
      evaluacion = await prisma.evaluacionFinalEvaluador.create({
        data: {
          trabajoId: parseInt(trabajoId),
          evaluadorId: parseInt(evaluadorId),
        }
      });
    }

    // Obtenemos las notas asociadas
    const notas = await prisma.nota.findMany({
      where: {
        trabajoId: parseInt(trabajoId),
        profesorId: parseInt(evaluadorId)
      },
      include: {
        cpc: {
          include: {
            criterio: true,
            puntoControl: true
          }
        }
      }
    });


    // Agregamos el criterioId directamente en el objeto de la nota
    const notasConCriterioId = notas.map(nota => ({
      ...nota,
      criterioId: nota.cpc?.criterio?.criterioId
    }));

    return res.json({ ...evaluacion, notas: notasConCriterioId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
  



  const obtenerDatosTrabajoUsuario = async (req, res) => {
    const { trabajoId, userId } = req.params;
  
    try {
      // Obtener el trabajo junto con su área y los roles del usuario asociados a este trabajo
      const trabajo = await prisma.trabajo.findUnique({
        where: {
          id: parseInt(trabajoId), // Utilizar el trabajoId pasado como parámetro
        },
        include: {
          area: {
            include: {
              areaRubrica: {
                include: {
                  rubrica: true, // Incluir la rúbrica asociada
                },
              },
            },
          },
          usuarioTrabajoRoles: {
            where: {
              usuarioId: parseInt(userId), // Filtrar por el usuarioId proporcionado
            },
            include: {
              rol: true, // Incluir el rol del usuario
            },
          },
        },
      });
  
      // Verificar si no se encuentra el trabajo
      if (!trabajo) {
        return res.status(404).json({ message: "Trabajo no encontrado" });
      }
  
      // Verificar que el usuario tiene un rol asociado a este trabajo
      const usuarioRol = trabajo.usuarioTrabajoRoles.length > 0 ? trabajo.usuarioTrabajoRoles[0].rol : null;
  
      if (!usuarioRol) {
        return res.status(404).json({ message: "Rol de usuario no encontrado para este trabajo" });
      }
  
      // Buscar la rúbrica con el mismo rolId que el rol del usuario
      const rubrica = trabajo.area.areaRubrica.find(r => r.rubrica.rolId === usuarioRol.id)?.rubrica;
  
      if (!rubrica) {
        return res.status(404).json({ message: "Rúbrica no asociada al área de este trabajo con el rol correcto" });
      }
  
  
      // Verificar si el rol del usuario y el rol de la rúbrica son el mismo
      if (usuarioRol.id !== rubrica.rolId) {
        return res.status(403).json({ message: "El rol del usuario no coincide con el rol de la rúbrica" });
      }
  
      // Devolver el rol y el id de la rúbrica
      return res.status(200).json({
        rubricaId: rubrica.id, // ID de la rúbrica asociada al área del trabajo
        rolNombre: usuarioRol.nombre, // Nombre del rol
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  

  const obtenerEvaluacionFinalTutorConNotas = async (req, res) => {
    const { trabajoId, usuarioId } = req.params;
  
    try {

      const evaluacionesExistentes = await prisma.evaluacionFinalTutor.findMany({
        where: { trabajoId: parseInt(trabajoId) },
      });
  
      // Si no existen evaluaciones, las creamos
      if (evaluacionesExistentes.length === 0) {
        // Obtener el trabajo y su rúbrica asociada (a través de area -> areaRubrica -> rubrica)
        const trabajo = await prisma.trabajo.findUnique({
          where: {
            id: parseInt(trabajoId),
          },
          include: {
            area: {
              include: {
                areaRubrica: {
                  include: {
                    rubrica: {
                      include: {
                        puntosDeControl: true,
                      },
                    },
                  },
                },
              },
            
            },
          },
        });
  
        // Validamos que exista una rúbrica con puntos de control
        const puntosDeControl = trabajo?.area?.areaRubrica?.[0]?.rubrica?.puntosDeControl || [];
  
        if (puntosDeControl.length > 0) {
          const evaluacionesACrear = puntosDeControl.map((pc) => ({
            trabajoId: parseInt(trabajoId),
            puntoControlId: pc.id,
          }));
  
          await prisma.evaluacionFinalTutor.createMany({
            data: evaluacionesACrear,
          });
        }
      }
  
      // Volvemos a buscar ahora que deberían estar creadas
      const evaluaciones = await prisma.evaluacionFinalTutor.findMany({
        where: {
          trabajoId: parseInt(trabajoId),
        },
        include: {
          puntoControl: {
            include: {
              criterios: {
                include: {
                  criterio: true,
                  notas: {
                    where: {
                      trabajoId: parseInt(trabajoId),
                      profesorId: parseInt(usuarioId),
                    },
                    select: {
                      nota: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      
      res.json(evaluaciones);
    } catch (error) {
      console.error('Error al obtener evaluaciones finales:', error);
      res.status(500).json({ error: 'Error al obtener las evaluaciones del tutor' });
    }
  };
  
        
  
          
    
  const crearEvaluacionFinalTutor = async (req, res) => {
    const { trabajoId, puntoControlId } = req.params;
  
    try {
      // Verificar si ya existe una evaluación final para este trabajo y punto de control
      const evaluacionExistente = await prisma.evaluacionFinalTutor.findFirst({
        where: {
          trabajoId: parseInt(trabajoId),
          puntoControlId: parseInt(puntoControlId),
        },
      });
  
      if (evaluacionExistente) {
        // Si ya existe, no hacer nada
        return res.status(200).json({ mensaje: 'Evaluación final del tutor ya existe' });
      }
  
      // Crear la nueva evaluación final del tutor
      const nuevaEvaluacion = await prisma.evaluacionFinalTutor.create({
        data: {
          trabajoId: parseInt(trabajoId),
          puntoControlId: parseInt(puntoControlId),
          // Los demás campos se dejan en null por defecto
          notaFinalPC: null,
          observacionPC: null,
        },
      });
  
      return res.status(201).json(nuevaEvaluacion);
    } catch (error) {
      console.error('Error al crear la evaluación final del tutor:', error);
      return res.status(500).json({ error: 'Error al crear la evaluación final del tutor' });
    }
  };

  async function obtenerRubricaConRolEvaluador(req, res) {
    const { trabajoId } = req.params;
  
    try {
      // Obtener el trabajo junto con su área y los roles del usuario asociados a este trabajo
      const trabajo = await prisma.trabajo.findUnique({
        where: {
          id: parseInt(trabajoId), // Utilizar el trabajoId pasado como parámetro
        },
        include: {
          area: {
            include: {
              areaRubrica: {
                include: {
                  rubrica: true, // Incluir la rúbrica asociada
                },
              },
            },
          },
        },
      });
  
      // Verificar si no se encuentra el trabajo
      if (!trabajo) {
        return res.status(404).json({ message: "Trabajo no encontrado" });
      }
  
      // Buscar la rúbrica con el rol de evaluador
      const rubricaEvaluador = trabajo.area.areaRubrica.find(r => r.rubrica.rolId === 2)?.rubrica;
  
      // Verificar si se ha encontrado una rúbrica con el rol de evaluador
      if (!rubricaEvaluador) {
        return res.status(404).json({ message: "No se encontró una rúbrica con el rol de evaluador para este trabajo" });
      }
  
      // Devolver el ID de la rúbrica
      return res.status(200).json({
        rubricaId: rubricaEvaluador.id, // ID de la rúbrica asociada al área del trabajo con el rol de evaluador
      });
    } catch (error) {
      console.error("Error al obtener la rúbrica con rol evaluador:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  
  async function obtenerEvaluacionesFinalesEvaluadoresDeTrabajo(req, res) {
    const { trabajoId } = req.params;
  
    try {
      const evaluaciones = await prisma.evaluacionFinalEvaluador.findMany({
        where: {
          trabajoId: parseInt(trabajoId),
        },
        include: {
          evaluador: true,
        },
      });
  
      if (evaluaciones.length === 0) {
        return res.status(200).json({ message: 'No se encontraron evaluaciones finales para este trabajo.' });
      }
  
      const notas = await prisma.nota.findMany({
        where: {
          trabajoId: parseInt(trabajoId),
        },
        include: {
          cpc: {
            select: {
              criterioId: true,
            },
          },
        },
      });
  
      const evaluacionesConNotas = evaluaciones.map(evaluacion => {
        const criterios = {};
  
        notas
          .filter(nota => nota.profesorId === evaluacion.evaluadorId)
          .forEach(nota => {
            if (nota.cpc) { // ✅ Comprobamos que exista
              criterios[nota.cpc.criterioId] = nota.nota;
            }
          });
  
        return {
          evaluadorId: evaluacion.evaluadorId,
          observaciones: evaluacion.observaciones,
          matricula: evaluacion.matricula,
          notaFinal: evaluacion.notaFinal,
          criterios
        };
      });
  
      return res.status(200).json(evaluacionesConNotas);
    } catch (error) {
      console.error('Error al obtener evaluaciones finales de evaluadores:', error);
      return res.status(500).json({ error: 'Error interno al obtener evaluaciones.' });
    }
  }
    


  module.exports = { 
    crearNotaEvaluador, 
    crearNotaTutor,
    crearEvaluacionFinalTutor,
    crearActualizarEvaluacionFinalEvaluador, 
    crearActualizarEvaluacionFinalTutor,
    obtenerEvaluacionFinalEvaluador,
    obtenerEvaluacionFinalTutorConNotas,
    obtenerDatosTrabajoUsuario,
    obtenerRubricaConRolEvaluador,
    obtenerEvaluacionesFinalesEvaluadoresDeTrabajo
};



