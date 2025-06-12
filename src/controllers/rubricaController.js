const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una nueva rúbrica con puntos de control dinámicos y peso calculado
const crearRubrica = async (req, res) => {
  const { nombre, rolId, numPuntosDeControl } = req.body;

  try {
    const nuevaRubrica = await prisma.rubricas.create({
      data: {
        nombre,
        rol: { connect: { id: rolId } },
      },
    });

    const pesoPorPunto = 100 / numPuntosDeControl;
    const puntosDeControlCreados = [];

    // Crear los puntos de control uno a uno para asegurar el orden de los IDs
    for (let i = 0; i < numPuntosDeControl; i++) {
      const punto = await prisma.puntosDeControl.create({
        data: {
          nombre: `${i + 1}`,
          peso: pesoPorPunto,
          rubrica: { connect: { id: nuevaRubrica.id } },
        },
      });
      puntosDeControlCreados.push(punto);
    }

    res.status(201).json({ nuevaRubrica, puntosDeControlCreados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la rúbrica y los puntos de control', detalles: error.message });
  }
};

// Crear un nuevo criterio y asociarlo a los puntos de control de la rúbrica
const crearCriterio = async (req, res) => {
  const { nombre,nombreEs,nombreEn , rubricaId, pesosPuntosControl } = req.body;

  try {
    // Crear el nuevo criterio
    const nuevoCriterio = await prisma.criterios.create({
      data: {
        nombre,
        nombreEs,
        nombreEn,
        rubrica: { connect: { id: rubricaId } },
      },
    });

    // Convertir pesosPuntosControl en un array de relaciones para la tabla CriterioPuntoControl
    const relacionesCriterioPuntoControl = Object.entries(pesosPuntosControl).map(([puntoControlId, peso]) => ({
      criterioId: nuevoCriterio.id,
      puntoControlId: parseInt(puntoControlId), // Convertir clave a número
      peso: parseFloat(peso), // Asegurar que es un número decimal
    }));

    // Insertar las relaciones en la tabla CriterioPuntoControl
    await prisma.criterioPuntoDeControl.createMany({
      data: relacionesCriterioPuntoControl,
    });

    res.status(201).json(nuevoCriterio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el criterio', detalles: error.message });
  }
};

// Obtener los criterios y sus puntos de control asociados a una rúbrica
const obtenerCriteriosConPuntosControl = async (req, res) => {
  const { rubricaId } = req.params;

  try {
    // Obtener los criterios asociados a la rúbrica
    const criterios = await prisma.criterios.findMany({
      where: { rubricaId: parseInt(rubricaId) },
      include: {
        // Incluir la relación con la rubrica
        rubrica: true,
      },
    });

    // Obtener todos los puntos de control asociados a la rúbrica
    const puntosDeControl = await prisma.puntosDeControl.findMany({
      where: { rubricaId: parseInt(rubricaId) },
      include: {
        // Incluir la relación con la rubrica
        rubrica: true,
      },
    });

    // Obtener las relaciones entre criterios y puntos de control (CriterioPuntoDeControl)
    const criteriosPuntosControl = await prisma.criterioPuntoDeControl.findMany({
      where: { criterio: { rubricaId: parseInt(rubricaId) } },  // Filtramos por la rúbrica
      include: {
        // Incluir las relaciones de los puntos de control y criterios
        criterio: true,
        puntoControl: true,
      },
    });

    // Formatear la respuesta para incluir los puntos de control correspondientes a cada criterio
    const resultado = criterios.map(criterio => {
      // Filtrar las relaciones de este criterio
      const relaciones = criteriosPuntosControl.filter(rel => rel.criterioId === criterio.id);

      return {
        ...criterio,
        puntosDeControl: relaciones.map(rel => {
          return {
            ...rel.puntoControl,  // Incluir el punto de control relacionado
            peso: rel.peso,       // Incluir el peso de la relación
          };
        }),
      };
    });

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los criterios y puntos de control', detalles: error.message });
  }
};


// Asignar una rúbrica a un área
const asignarRubricaAArea = async (req, res) => {
  const { areaId, rubricaId } = req.body;

  try {
    // 1. Verificar cuántas rúbricas están asignadas al área
    const rubricasAsignadas = await prisma.areaRubrica.count({
      where: { areaId },
    });

    // Si ya hay 2 rúbricas asignadas, no se puede añadir otra
    if (rubricasAsignadas >= 2) {
      return res.status(400).json({ error: 'Ya hay dos rúbricas asignadas a esta área.' });
    }

    // 2. Verificar que la rúbrica que se intenta asignar tenga un rol diferente
    const rubricaNueva = await prisma.rubricas.findUnique({
      where: { id: rubricaId },
      include: { rol: true }, // Incluir el objeto rol completo
    });

    // Si la rúbrica no se encuentra
    if (!rubricaNueva) {
      return res.status(404).json({ error: 'Rúbrica no encontrada' });
    }

    // 3. Verificar que el rol de la nueva rúbrica sea distinto a las ya asignadas
    const rubricaAsignada = await prisma.areaRubrica.findFirst({
      where: { areaId },
      include: { rubrica: { include: { rol: true } } }, // Incluir el rol de las rúbricas asignadas
    });

    if (rubricaAsignada && rubricaNueva.rol.id === rubricaAsignada.rubrica.rol.id) {
      return res.status(400).json({
        error: 'La rúbrica que intentas asignar tiene el mismo rol que la ya asignada.',
      });
    }

    // 4. Si todas las comprobaciones son correctas, asignamos la rúbrica
    const asignacion = await prisma.areaRubrica.create({
      data: {
        area: { connect: { id: areaId } },
        rubrica: { connect: { id: rubricaId } },
      },
    });

    res.status(201).json(asignacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asignar la rúbrica al área', detalles: error.message });
  }
};

// Obtener los puntos de control por rúbrica
const obtenerPuntosDeControlPorRubrica = async (req, res) => {
  const { rubricaId } = req.params;

  try {
    const puntos = await prisma.puntosDeControl.findMany({
      where: { rubricaId: parseInt(rubricaId) },
    });

    res.status(200).json(puntos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los puntos de control', detalles: error.message });
  }
};


// Obtener rúbricas por área
const obtenerRubricasPorArea = async (req, res) => {
  const { areaId } = req.params;

  try {
    const areaRubricas = await prisma.areaRubrica.findMany({
      where: { areaId: parseInt(areaId) },
      include: { rubrica: true },
    });

    const rubricas = areaRubrica.map((ar) => ar.rubrica);
    res.status(200).json(rubricas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener rúbricas del área', detalles: error.message });
  }
};

const actualizarPesoPuntoControl = async (req, res) => {
    const { id, nuevoPeso } = req.body;
  
    try {
      const puntoControlActualizado = await prisma.CriterioPuntoControl.update({
        where: { id },
        data: { peso: nuevoPeso },
      });
  
      res.status(200).json({ message: 'Peso actualizado correctamente', puntoControlActualizado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el peso del punto de control' });
    }
  };

  // Obtener todas las rúbricas
  const obtenerRubricas = async (req, res) => {
    try {
      const rubricas = await prisma.rubricas.findMany({
        include: {
          rol: true, // Opcional: incluye datos del rol si quieres mostrar el nombre del rol
        }
      });
      res.status(200).json(rubricas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las rúbricas', detalles: error.message });
    }
  };

  const desasignarRubricaAArea = async (req, res) => {
    const { areaId, rubricaId } = req.body;
  
    try {
      // Verificar si la rúbrica está asignada al área
      const asignacionExistente = await prisma.areaRubrica.findFirst({
        where: { areaId, rubricaId },
      });
  
      if (!asignacionExistente) {
        return res.status(404).json({ error: 'La rúbrica no está asignada a esta área.' });
      }
  
      // Desasignar la rúbrica del área
      await prisma.areaRubrica.delete({
        where: { id: asignacionExistente.id },
      });
  
      res.status(200).json({ message: 'Rúbrica desasignada correctamente del área.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al desasignar la rúbrica del área', detalles: error.message });
    }
  };

  // Editar una rúbrica existente
const editarRubrica = async (req, res) => {
  const { rubricaId } = req.params;  // ID de la rúbrica a editar
  const { nombre, rolId } = req.body;  // Nuevos datos para la rúbrica

  try {
    // Primero, verificamos si la rúbrica existe
    const rubricaExistente = await prisma.rubricas.findFirst({
      where: { id: parseInt(rubricaId) },
    });

    if (!rubricaExistente) {
      return res.status(404).json({ error: 'Rúbrica no encontrada' });
    }

    // Actualizamos los datos de la rúbrica
    const rubricaActualizada = await prisma.rubricas.update({
      where: { id: parseInt(rubricaId) },
      data: {
        nombre: nombre || rubricaExistente.nombre,  // Solo actualizamos si se ha proporcionado un nuevo nombre
        rol: rolId ? { connect: { id: rolId } } : undefined,  // Si se proporciona un nuevo rol, lo actualizamos
      },
    });


    res.status(200).json({ message: 'Rúbrica y puntos de control actualizados correctamente', rubricaActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar la rúbrica', detalles: error.message });
  }
};

// Eliminar una rúbrica
const eliminarRubrica = async (req, res) => {
  const { rubricaId } = req.params;

  try {
    const id = parseInt(rubricaId);

    // Verificar si la rúbrica existe
    const rubricaExistente = await prisma.rubricas.findUnique({
      where: { id },
    });

    if (!rubricaExistente) {
      return res.status(404).json({ error: 'Rúbrica no encontrada' });
    }

    // Obtener los criterios relacionados con la rúbrica
    const criterios = await prisma.criterios.findMany({
      where: { rubricaId: id },
      select: { id: true },
    });

    const criterioIds = criterios.map(c => c.id);

    // Eliminar registros en CriterioPuntoControl que usen estos criterios
    await prisma.criterioPuntoDeControl.deleteMany({
      where: {
        criterioId: { in: criterioIds },
      },
    });

    // Eliminar criterios asociados
    await prisma.criterios.deleteMany({
      where: { rubricaId: id },
    });

    // Eliminar puntos de control asociados
    await prisma.puntosDeControl.deleteMany({
      where: { rubricaId: id },
    });

    // Eliminar la asignación de rúbrica a áreas
    await prisma.areaRubrica.deleteMany({
      where: { rubricaId: id },
    });

    // Finalmente, eliminar la rúbrica
    await prisma.rubricas.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Rúbrica eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al eliminar la rúbrica',
      detalles: error.message,
    });
  }
};

// Obtener una rúbrica por su ID
const obtenerRubrica = async (req, res) => {
  const { rubricaId } = req.params;

  try {
    const rubrica = await prisma.rubricas.findUnique({
      where: { id: parseInt(rubricaId) },
      include: {
        rol: true, // Incluir datos del rol asociado a la rúbrica
        puntosDeControl: true, // Incluir los puntos de control asociados
      }
    });

    // Verificar si la rúbrica existe
    if (!rubrica) {
      return res.status(404).json({ error: 'Rúbrica no encontrada' });
    }

    res.status(200).json(rubrica);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la rúbrica', detalles: error.message });
  }
};

// Eliminar un criterio según su ID
const eliminarCriterio = async (req, res) => {
  const { criterioId } = req.params;

  try {
    // Verificar si el criterio existe
    const criterioExistente = await prisma.criterios.findUnique({
      where: { id: parseInt(criterioId) },
    });

    if (!criterioExistente) {
      return res.status(404).json({ error: 'Criterio no encontrado' });
    }

    // Eliminar las relaciones de CriterioPuntoControl asociadas al criterio
    await prisma.criterioPuntoDeControl.deleteMany({
      where: { criterioId: parseInt(criterioId) },
    });

    // Eliminar el criterio
    await prisma.criterios.delete({
      where: { id: parseInt(criterioId) },
    });

    res.status(200).json({ message: 'Criterio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el criterio', detalles: error.message });
  }
};

// Obtener todos los criterioPuntoControl por cada criterio en una rúbrica
const obtenerCriteriosConPuntosDeControlPorRubrica = async (req, res) => {
  const { rubricaId } = req.params;

  try {
    // Obtener los detalles de la rúbrica
    const rubrica = await prisma.rubricas.findUnique({
      where: { id: parseInt(rubricaId) },
      include: {
        rol: true, // Incluir el rol asociado a la rúbrica
      }
    });

    if (!rubrica) {
      return res.status(404).json({ error: 'Rúbrica no encontrada' });
    }

    // Obtener todos los criterios de la rúbrica con sus puntos de control
    const criterios = await prisma.criterios.findMany({
      where: { rubricaId: parseInt(rubricaId) },
      include: {
        criterioPuntoDeControl: {
          include: {
            puntoControl: true, // Incluir los datos de los puntos de control
          }
        }
      }
    });

    // Obtener todos los puntos de control de la rúbrica con su peso
    const puntosDeControl = await prisma.puntosDeControl.findMany({
      where: { rubricaId: parseInt(rubricaId) }
    });

    // Formatear los resultados
    const resultado = {
      rubrica: {
        id: rubrica.id,
        nombre: rubrica.nombre,
        descripcion: rubrica.descripcion,
        rol: {
          id: rubrica.rol.id,
          nombre: rubrica.rol.nombre,
        }
      },
      
      criterios: criterios.map(criterio => ({
        criterioId: criterio.id,
        criterioNombre: criterio.nombre,
        criterioNombreEs: criterio.nombreEs,
        criterioNombreEn: criterio.nombreEn,
        puntosDeControl: criterio.criterioPuntoDeControl.map(relacion => {
          const punto = puntosDeControl.find(p => p.id === relacion.puntoControl.id);
          return {
            puntoControlId: relacion.puntoControl.id,
            puntoControlNombre: relacion.puntoControl.nombre,
            cpcId: relacion.id,
            pesoRelacion: relacion.peso,  // Peso de la relación con el criterio
            pesoPuntoControl: punto ? punto.peso : null  // Peso del punto de control en la rúbrica
          };
        })
      }))
    };

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos de la rúbrica', detalles: error.message });
  }
};


const editarCriterio = async (req, res) => {
  const { criterioId } = req.params;
  const { nuevoNombre, nuevoNombreEs, nuevoNombreEn, nuevosPesosPuntosControl } = req.body;

  try {
    // Verificar si el criterio existe
    const criterioExistente = await prisma.criterios.findUnique({
      where: { id: parseInt(criterioId) },
    });

    if (!criterioExistente) {
      return res.status(404).json({ error: 'Criterio no encontrado' });
    }

    // Actualizar el nombre si se ha proporcionado uno nuevo
    const criterioActualizado = await prisma.criterios.update({
      where: { id: parseInt(criterioId) },
      data: {
        nombre: nuevoNombre || criterioExistente.nombre,
        nombreEs: nuevoNombreEs,
        nombreEn: nuevoNombreEn ,

      },
    });

    // Si se proporcionan nuevos pesos para puntos de control, actualizarlos
    if (nuevosPesosPuntosControl) {
      const actualizaciones = await Promise.all(
        Object.entries(nuevosPesosPuntosControl).map(async ([puntoControlId, nuevoPeso]) => {
          return prisma.criterioPuntoDeControl.updateMany({
            where: {
              criterioId: parseInt(criterioId),
              puntoControlId: parseInt(puntoControlId),
            },
            data: {
              peso: parseFloat(nuevoPeso),
            },
          });
        })
      );
    }

    res.status(200).json({ message: 'Criterio actualizado correctamente', criterioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar el criterio', detalles: error.message });
  }
};

// Editar un punto de control
const editarPuntoDeControl = async (req, res) => {
  const { id } = req.params; // ID del punto de control a editar
  const { nombre, peso } = req.body; // Nuevos datos para el punto de control

  try {
    // Verificar si el punto de control existe
    const puntoControlExistente = await prisma.puntosDeControl.findUnique({
      where: { id: parseInt(id) },
    });

    if (!puntoControlExistente) {
      return res.status(404).json({ error: 'Punto de control no encontrado' });
    }

    // Actualizar los datos del punto de control
    const puntoControlActualizado = await prisma.puntosDeControl.update({
      where: { id: parseInt(id) },
      data: {
        nombre: nombre || puntoControlExistente.nombre, // Solo actualizamos si se ha proporcionado un nuevo nombre
        peso: peso || puntoControlExistente.peso, // Solo actualizamos si se ha proporcionado un nuevo peso
      },
    });

    res.status(200).json({ message: 'Punto de control actualizado correctamente', puntoControlActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar el punto de control', detalles: error.message });
  }
};

module.exports = {
  crearRubrica,
  crearCriterio,
  asignarRubricaAArea,
  obtenerPuntosDeControlPorRubrica,
  obtenerRubricasPorArea,
  actualizarPesoPuntoControl,
  obtenerRubricas,
  desasignarRubricaAArea,
  editarRubrica,
  eliminarRubrica,
  obtenerRubrica,
  obtenerCriteriosConPuntosControl,
  eliminarCriterio,
  obtenerCriteriosConPuntosDeControlPorRubrica,
  editarCriterio,
  editarPuntoDeControl
};
