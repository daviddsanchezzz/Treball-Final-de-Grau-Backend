const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo trabajo
const crearTrabajo = async (req, res) => {
  const { titulo, descripcion, estudiante, areaId, tutorId } = req.body;

  try {
    // Buscar el rol de "tutor" en la tabla Roles
    const rolTutor = await prisma.roles.findFirst({
      where: { nombre: 'Tutor' },
    });

    if (!rolTutor) {
      return res.status(400).json({ error: 'Rol de tutor no encontrado' });
    }


    // Crear el trabajo
    const nuevoTrabajo = await prisma.trabajo.create({
      data: {
        titulo,
        descripcion,
        estudiante,
        tutor: { connect: { id: tutorId } },
        area: { connect: { id: areaId } },
      },
    });

    // Crear la relación en UsuarioTrabajoRol para asignar el rol de tutor al usuario
    const usuarioTrabajoRol = await prisma.usuarioTrabajoRol.create({
      data: {
        usuarioId: tutorId,
        trabajoId: nuevoTrabajo.id,
        rolId: rolTutor.id, // Usamos el id del rol de tutor encontrado
      },
    });

    // Devolver la respuesta con el trabajo creado y la relación
    res.status(201).json({
      trabajo: nuevoTrabajo,
      usuarioTrabajoRol,
    });
  } catch (error) {
    console.error(error);
    console.error("Error al crear el trabajo: ", error.message); // Mejorar el log de error
    res.status(500).json({ error: 'Error al crear el trabajo', detalles: error.message });
  }
};



const asignarEvaluadorATrabajo = async (req, res) => {
    const { trabajoId, evaluadorId } = req.body;
  
    try {
      // Comprobamos si ya está asignado el evaluador a este trabajo
      const evaluadorAsignado = await prisma.UsuarioTrabajoRol.findUnique({
        where: {
          trabajoId_usuarioId: {
            trabajoId,
            usuarioId: evaluadorId,
          },
        },
      });
  
      if (evaluadorAsignado) {
        return res.status(400).json({ message: 'El evaluador ya está asignado a este trabajo.' });
      }
  
      // Asignamos el evaluador al trabajo
      const asignacion = await prisma.UsuarioTrabajoRol.create({
        data: {
          trabajoId,
          usuarioId: evaluadorId,
          rolId: 3, 
        },
      });
  
      res.status(200).json({ message: 'Evaluador asignado correctamente', asignacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al asignar el evaluador al trabajo' });
    }
  };
  
  
  // Obtener todos los trabajos con los campos específicos
  const obtenerTrabajos = async (req, res) => {
    try {
      const trabajos = await prisma.trabajo.findMany({
        select: {
          id:true,
          titulo: true,        // Solo incluye el título del trabajo
          descripcion: true,   // Solo incluye la descripción del trabajo
          estudiante: true,    // Incluye el estudiante asociado
          areaId: true,        // Incluye el área asociada (ID)
          tutorId: true,       // Incluye el ID del tutor asociado
          estado: true,
        },
      });
  
      res.status(200).json(trabajos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los trabajos', detalles: error.message });
    }
  };
  
  const eliminarTrabajo = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Verificar si el trabajo existe
      const trabajoExistente = await prisma.trabajo.findUnique({
        where: {
          id: Number(id),
        },
      });
  
      if (!trabajoExistente) {
        return res.status(404).json({ message: 'Trabajo no encontrado' });
      }
  
      // Eliminar el trabajo
      await prisma.trabajo.delete({
        where: {
          id: Number(id),
        },
      });
  
      res.status(200).json({ message: 'Trabajo eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el trabajo', detalles: error.message });
    }
  };
  

  // Obtener un trabajo por su ID
const obtenerTrabajo = async (req, res) => {
  const { id } = req.params;

  try {
    const trabajo = await prisma.trabajo.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        estudiante: true,
        areaId: true,
        tutorId: true,
        estado: true,
      },
    });

    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    res.status(200).json(trabajo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el trabajo', detalles: error.message });
  }
};

// Editar un trabajo existente
const editarTrabajo = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, estudiante, areaId, tutorId, estado } = req.body;

  try {
    // Verificamos si el trabajo existe
    const trabajoExistente = await prisma.trabajo.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!trabajoExistente) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    // Actualizamos el trabajo
    const trabajoActualizado = await prisma.trabajo.update({
      where: {
        id: Number(id),
      },
      data: {
        titulo,
        descripcion,
        estudiante,
        area: { connect: { id: areaId } },
        tutor: { connect: { id: tutorId } },
        estado,
      },
    });

    res.status(200).json(trabajoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar el trabajo', detalles: error.message });
  }
};

const obtenerNombreEvaluadores = async (req, res) => {
  const { trabajoId } = req.params;


  try {
    // Obtener el ID del rol de "Evaluador" desde la tabla roles
    const rolEvaluador = await prisma.roles.findFirst({
      where: {
        nombre: "Evaluador",  // Buscamos el rol por el nombre
      }
    });

    if (!rolEvaluador) {
      return res.status(404).json({ message: 'Rol de Evaluador no encontrado' });
    }

    // Obtener los usuarios con el rol de "Evaluador" para el trabajo específico
    const evaluadores = await prisma.usuarioTrabajoRol.findMany({
      where: {
        trabajoId: Number(trabajoId),
        rolId: rolEvaluador.id, // Usamos el ID del rol de Evaluador
      },
      include: {
        usuario: {
          select: {
            id: true,    // También seleccionamos el id del usuario
            nombre: true,  // Solo obtenemos el nombre del usuario
          },
        },
      },
    });

    if (evaluadores.length === 0) {
      return res.status(404).json({ message: 'No hay evaluadores asignados a este trabajo' });
    }

    // Extraemos el id y el nombre de los evaluadores
    const evaluadoresInfo = evaluadores.map((evaluador) => ({
      id: evaluador.usuario.id,
      nombre: evaluador.usuario.nombre,
    }));

    res.status(200).json({ evaluadores: evaluadoresInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los evaluadores', detalles: error.message });
  }
};


const asignarEvaluador = async (req, res) => {
  const { trabajoId, usuarioId } = req.body;

  try {
    // Obtener el ID del rol de "Evaluador" desde la tabla roles
    const rolEvaluador = await prisma.roles.findFirst({
      where: {
        nombre: "Evaluador",  // Buscamos el rol por el nombre
      }
    });

    if (!rolEvaluador) {
      return res.status(404).json({ message: 'Rol de Evaluador no encontrado' });
    }

    // Comprobar si ya está asignado el evaluador a este trabajo
    const evaluadorAsignado = await prisma.usuarioTrabajoRol.findFirst({
      where: {
        AND: [
          { trabajoId: trabajoId },
          { usuarioId: usuarioId }
        ]
      },
    });

    if (evaluadorAsignado) {
      return res.status(400).json({ message: 'El evaluador ya está asignado a este trabajo.' });
    }

    // Asignar el evaluador al trabajo
    const asignacion = await prisma.usuarioTrabajoRol.create({
      data: {
        trabajoId,
        usuarioId,
        rolId: rolEvaluador.id, // Usamos el ID del rol de Evaluador
      },
    });

    res.status(200).json({ message: 'Evaluador asignado correctamente', asignacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al asignar el evaluador al trabajo' });
  }
};

const eliminarEvaluador = async (req, res) => {

  const trabajoId = parseInt(req.params.id, 10);  
  const evaluadorId = parseInt(req.params.evaluadorId, 10);  



  try {
    // Comprobar si el evaluador está asignado a este trabajo
    const evaluadorAsignado = await prisma.usuarioTrabajoRol.findFirst({
      where: {
        AND: [
          { trabajoId: trabajoId },
          { usuarioId: evaluadorId }
        ]
      },
    });

    if (!evaluadorAsignado) {
      return res.status(400).json({ message: 'El evaluador no está asignado a este trabajo.' });
    }

    // Eliminar la asignación del evaluador al trabajo
    await prisma.usuarioTrabajoRol.delete({
      where: {
        id: evaluadorAsignado.id,  // Usamos el ID de la asignación encontrada
      },
    });

    res.status(200).json({ message: 'Evaluador eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el evaluador del trabajo' });
  }
};

const obtenerEstadosDisponibles = (res) => {
  try {
    const estados = Prisma.dmmf.datamodel.enums.find(e => e.name === 'Estado').values.map(v => v.name);
    res.status(200).json({ estados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudieron obtener los estados disponibles' });
  }
};

const cambiarEstadoTrabajo = async (req, res) => {
  const { trabajoId } = req.params;
  const { nuevoEstado } = req.body;

  try {
    // Validar si el nuevo estado es uno de los definidos en el enum
    const estadosValidos = Prisma.dmmf.datamodel.enums.find(e => e.name === 'Estado').values.map(v => v.name);
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    // Buscar y actualizar el trabajo
    const trabajoActualizado = await prisma.trabajo.update({
      where: { id: parseInt(trabajoId) },
      data: { estado: nuevoEstado },
    });

    res.status(200).json({ mensaje: 'Estado actualizado correctamente', trabajo: trabajoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado del trabajo' });
  }
};


async function actualizarNotaFinalTutor(req, res) {
  const { nota } = req.body;
  const { trabajoId } = req.params;

  // Validar que el trabajoId y la nota se han recibido
  if (!trabajoId || typeof nota !== 'number') {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }

  try {
    // Actualizamos el campo 'notaFinalTutor' del trabajo con el trabajoId correspondiente
    const trabajoActualizado = await prisma.trabajo.update({
      where: {
        id: parseInt(trabajoId)
      },
      data: {
        notaFinalTutor: parseFloat(nota)
      }
    });

    // Respondemos con el trabajo actualizado
    return res.status(200).json(trabajoActualizado);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la nota final del tutor' });
  }
}

async function resetearNotaFinalTutor(req, res) {
  const { trabajoId } = req.params;

  // Validar que el trabajoId se ha recibido
  if (!trabajoId) {
    return res.status(400).json({ error: 'Falta el trabajoId' });
  }

  try {
    // Actualizamos el campo 'notaFinalTutor' a null para el trabajo con el trabajoId correspondiente
    const trabajoActualizado = await prisma.trabajo.update({
      where: {
        id: parseInt(trabajoId)
      },
      data: {
        notaFinalTutor: null
      }
    });

    // Respondemos con el trabajo actualizado
    return res.status(200).json(trabajoActualizado);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    return res.status(500).json({ error: 'Error al resetear la nota final del tutor' });
  }
}

async function obtenerNotaFinalTutor(req, res) {
  const { trabajoId } = req.params;

  // Validar que el trabajoId se ha recibido
  if (!trabajoId) {
    return res.status(400).json({ error: 'Falta el trabajoId' });
  }
  console.log(trabajoId)

  try {
    // Obtenemos el trabajo y su notaFinalTutor
    const trabajo = await prisma.trabajo.findUnique({
      where: {
        id: parseInt(trabajoId), 
      },
      select: {
        id: true,
        titulo: true,
        notaFinalTutor: true
      }
    });

    if (!trabajo) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    const notaFinalTutor = trabajo.notaFinalTutor !== null ? trabajo.notaFinalTutor : null;


    // Respondemos con la nota final del tutor
    return res.status(200).json({
      notaFinalTutor: notaFinalTutor
    });
  } catch (error) {
    // Manejo de errores
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la nota final del tutor' });
  }
}

async function actualizarNotasTrabajo(req, res) {
  const { trabajoId } = req.params;
  const { notaMediaEvaluadores, notaFinalTutor, notaFinalTrabajo } = req.body;

  try {
    // Actualizamos el trabajo
    const trabajoActualizado = await prisma.trabajo.update({
      where: {
        id: parseInt(trabajoId),
      },
      data: {
        notaMediaEvaluadores: notaMediaEvaluadores,
        notaFinalTutor: notaFinalTutor,
        notaFinalTrabajo: notaFinalTrabajo,
      },
    });

    res.status(200).json({
      message: 'Notas actualizadas correctamente.',
      trabajo: trabajoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar las notas del trabajo:', error);
    res.status(500).json({ error: 'Error al actualizar las notas del trabajo.' });
  }
}


  module.exports = { crearTrabajo, asignarEvaluador, obtenerTrabajos, eliminarTrabajo,
    obtenerTrabajo, editarTrabajo, obtenerNombreEvaluadores, eliminarEvaluador, obtenerEstadosDisponibles,
    cambiarEstadoTrabajo,actualizarNotaFinalTutor,resetearNotaFinalTutor, obtenerNotaFinalTutor,actualizarNotasTrabajo
  };
  