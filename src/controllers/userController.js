const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  const { nombre, email, contraseña, esAdmin } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });

    if (usuarioExistente) return res.status(400).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, email, contraseña: hashedPassword, esAdmin },
    });

    const { contraseña: _, ...usuarioSinContraseña } = nuevoUsuario;
    res.status(201).json(usuarioSinContraseña);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario', detalles: error.message });
  }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
  const { email, contraseña } = req.body;

  // Validación de que los campos no estén vacíos
  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Por favor, ingrese email y contraseña' });
  }

  try {
    // Buscar el usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que la contraseña sea correcta
    const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValido) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Preparar datos para el JWT
    const data = { id: usuario.id, email: usuario.email, nombre: usuario.nombre , esAdmin: usuario.esAdmin}; // Incluye el nombre

    // Generar el token JWT
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Responder con éxito y el token
    return res.status(200).json({ message: 'Inicio de sesión exitoso', token, data });
  } catch (error) {
    console.error(error);
    // Responder con un error genérico
    return res.status(500).json({ error: 'Error al iniciar sesión', detalles: error.message });
  }
};

// Obtener todos los trabajos en los que el usuario está relacionado
const obtenerTrabajosUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      include: {
        trabajos: { // Relación con UsuarioTrabajoRol
          include: {
            trabajo: true, // Información sobre el trabajo
            rol: true,     // Información sobre el rol (Tutor, Evaluador, etc.)
          },
        },
      },
    });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificación si existen trabajos asociados al usuario
    const trabajosConRol = usuario.trabajos && usuario.trabajos.length > 0
      ? usuario.trabajos.map((usuarioTrabajoRol) => ({
          trabajo: usuarioTrabajoRol.trabajo,
          rol: usuarioTrabajoRol.rol.nombre, // Obtener el nombre del rol
        }))
      : []; // Si no hay trabajos, devolver un array vacío

    // Si no se encuentran trabajos, responder con mensaje adecuado
    if (trabajosConRol.length === 0) {
      return res.status(404).json({ error: 'El usuario no tiene trabajos asignados' });
    }

    res.status(200).json(trabajosConRol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los trabajos del usuario', detalles: error.message });
  }
};


const asignarEvaluadorATrabajo = async (req, res) => {
    const { trabajoId, evaluadorId } = req.body;
  
    try {
      // Comprobamos si ya está asignado el evaluador a este trabajo
      const evaluadorAsignado = await prisma.TrabajoEvaluador.findUnique({
        where: {
          trabajoId_evaluadorId: {
            trabajoId,
            evaluadorId,
          },
        },
      });
  
      if (evaluadorAsignado) {
        return res.status(400).json({ message: 'El evaluador ya está asignado a este trabajo.' });
      }
  
      // Asignamos el evaluador al trabajo
      const asignacion = await prisma.TrabajoEvaluador.create({
        data: {
          trabajoId,
          evaluadorId,
        },
      });
  
      res.status(200).json({ message: 'Evaluador asignado correctamente', asignacion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al asignar el evaluador al trabajo' });
    }
  };

  const obtenerUsuarios = async (req, res) => {
    try {
      const usuarios = await prisma.usuario.findMany({

        select: {
          id: true,
          nombre: true,
          email: true,
          esAdmin: true,
        },
      });
  
      if (usuarios.length === 0) {
        return res.status(404).json({ error: 'No hay usuarios no administradores' });
      }
  
      res.status(200).json(usuarios); // Devolver los usuarios encontrados
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los usuarios', detalles: error.message });
    }
  };
  
  
  // Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // Verificamos si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(usuarioId) } });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminamos el usuario
    await prisma.usuario.delete({ where: { id: parseInt(usuarioId) } });

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario', detalles: error.message });
  }
};

// Obtener un usuario por su ID
const obtenerUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // Buscar el usuario por ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) }, // Convertir el usuarioId a número
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver la información del usuario sin la contraseña
    const { contraseña, ...usuarioSinContraseña } = usuario;
    res.status(200).json(usuarioSinContraseña);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario', detalles: error.message });
  }
};



const editarContraseña = async (req, res) => {
  const { usuarioId } = req.params;
  const { contraseñaActual, nuevaContraseña } = req.body;

  console.log('BODY recibido:', req.body);

  try {
    // Validar campos requeridos
    if (!contraseñaActual || !nuevaContraseña) {
      return res.status(400).json({ message: 'Has d\'introduir la contrasenya actual i la nova contrasenya.' });
    }

    // Buscar usuario por ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'No s\'ha trobat cap usuari amb aquest ID.' });
    }

    // Verificar contraseña actual
    const esValida = await bcrypt.compare(contraseñaActual, usuario.contraseña);
    if (!esValida) {
      return res.status(400).json({ message: 'La contrasenya actual no és correcta.' });
    }

    // Verificar si la nueva contraseña es igual a la actual
    const mismaContrasenya = await bcrypt.compare(nuevaContraseña, usuario.contraseña);
    if (mismaContrasenya) {
      return res.status(400).json({ message: 'La nova contrasenya ha de ser diferent de l\'actual.' });
    }

    // Hashear y guardar la nueva contraseña
    const nuevaContrasenyaHash = await bcrypt.hash(nuevaContraseña, 10);

    await prisma.usuario.update({
      where: { id: parseInt(usuarioId) },
      data: { contraseña: nuevaContrasenyaHash },
    });

    return res.status(200).json({ message: 'Contrasenya actualitzada correctament.' });

  } catch (error) {
    console.error('Error en editarContraseña:', error);
    return res.status(500).json({
      message: 'S\'ha produït un error inesperat en actualitzar la contrasenya.',
      error: error.message,
    });
  }
};

// Editar información de un usuario
const editarUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  const { nombre, email, esAdmin } = req.body;

  try {
    // Buscar si el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el email ya existe en otro usuario
    if (email && email !== usuario.email) {
      const emailExistente = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    // Actualizar el usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(usuarioId) },
      data: {
        nombre: nombre !== undefined ? nombre : usuario.nombre,
        email: email !== undefined ? email : usuario.email,
        esAdmin: esAdmin !== undefined ? esAdmin : usuario.esAdmin,
      },
    });

    // Devolver el usuario actualizado sin la contraseña
    const { contraseña, ...usuarioSinContraseña } = usuarioActualizado;
    res.status(200).json(usuarioSinContraseña);
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    res.status(500).json({
      error: 'Error al editar el usuario',
      detalles: error.message,
    });
  }
};


module.exports = { crearUsuario, loginUsuario, obtenerTrabajosUsuario, asignarEvaluadorATrabajo,
   obtenerUsuarios, eliminarUsuario, obtenerUsuario, editarContraseña, editarUsuario};
