const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo rol
const crearRol = async (req, res) => {
  const { nombre } = req.body;

  try {
    const nuevoRol = await prisma.roles.create({
      data: { nombre },
    });
    res.status(201).json(nuevoRol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el rol', detalles: error.message });
  }
};

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los roles', detalles: error.message });
  }
};

const asignarRolAUsuarioEnTrabajo = async (req, res) => {
    const { usuarioId, trabajoId, rolId } = req.body;
  
    try {
      // Comprobamos si ya está asignado este rol al usuario en el trabajo
      const rolAsignado = await prisma.UsuarioTrabajoRol.findUnique({
        where: {
          usuarioId_trabajoId_rolId: {
            usuarioId,
            trabajoId,
            rolId,
          },
        },
      });
  
      if (rolAsignado) {
        return res.status(400).json({ message: 'Este rol ya está asignado al usuario en este trabajo.' });
      }
  
      // Asignamos el rol al usuario en el trabajo
      const asignacion = await prisma.UsuarioTrabajoRol.create({
        data: {
          usuarioId,
          trabajoId,
          rolId,
        },
      });
  
      res.status(200).json({ message: 'Rol asignado correctamente al usuario en el trabajo.', asignacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al asignar el rol al usuario en el trabajo.' });
    }
  };
  
  // Obtener un rol por su ID y devolver su nombre
const obtenerRol = async (req, res) => {
  const { id } = req.params;  // El ID del rol que recibimos en la URL

  try {
    const rol = await prisma.roles.findUnique({
      where: { id: Number(id) },  // Buscamos el rol por su ID
    });

    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    res.status(200).json({ nombre: rol.nombre });  // Devolvemos solo el nombre
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el rol', detalles: error.message });
  }
};

// Eliminar un rol por ID
const eliminarRol = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificamos si el rol existe
    const rolExistente = await prisma.roles.findUnique({
      where: { id: Number(id) },
    });

    if (!rolExistente) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Eliminamos el rol
    await prisma.roles.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el rol', detalles: error.message });
  }
};


module.exports = { crearRol, obtenerRoles, asignarRolAUsuarioEnTrabajo, obtenerRol, eliminarRol };


