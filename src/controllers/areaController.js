const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear una nueva área
const crearArea = async (req, res) => {
  const { nombre, tutor, avaluador } = req.body;


  try {
    const nuevaArea = await prisma.area.create({
      data: {
        nombre,
        percentatgeFinalTutor: parseFloat(tutor),
        percentatgeFinalAvaluadors: parseFloat(avaluador),
      },
    });

    res.status(201).json(nuevaArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el área', detalles: error.message });
  }
};


// Editar un área
const editarArea = async (req, res) => {
  const { areaId, nombre, tutor, avaluador } = req.body;

  try {
    // Verificar si el área existe
    const areaExistente = await prisma.area.findUnique({ where: { id: parseInt(areaId) } });

    if (!areaExistente) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }

    // Actualizar el área con nombre y porcentajes
    const areaActualizada = await prisma.area.update({
      where: { id: parseInt(areaId) },
      data: { 
        nombre,
        percentatgeFinalTutor: parseFloat(tutor),
        percentatgeFinalAvaluadors: parseFloat(avaluador),
      },
    });

    res.status(200).json(areaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar el área', detalles: error.message });
  }
};


// Obtener todas las áreas
const obtenerAreas = async (req, res) => {
  try {
    const areas = await prisma.area.findMany();
    res.status(200).json(areas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las áreas', detalles: error.message });
  }
};

// Eliminar un área
const eliminarArea = async (req, res) => {
  const { areaId } = req.params;

  try {
    // Verificar si el área existe
    const areaExistente = await prisma.area.findUnique({ where: { id: parseInt(areaId) } });

    if (!areaExistente) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }

    // Eliminar el área
    await prisma.area.delete({ where: { id: parseInt(areaId) } });

    res.status(200).json({ message: 'Área eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el área', detalles: error.message });
  }
};

// Obtener los detalles de un área y sus rúbricas con los roles
const obtenerDetallesArea = async (req, res) => {
  const { id } = req.params;  // El ID del área desde la URL

  try {
    // Recuperar el área con sus rúbricas asociadas
    const area = await prisma.area.findUnique({
      where: { id: parseInt(id) },  // Buscar el área por su ID
      include: {
        areaRubrica: {
          include: {
            rubrica: {
              include: {
                rol: true, // Incluir el rol asociado a la rúbrica
              },
            },
          },
        },
      },
    });

    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }

    // Extraer las rúbricas y los roles asociados
    const rubricas = area.areaRubrica.map((item) => ({
      rubrica: item.rubrica.nombre,
      rubricaId: item.rubrica.id,
      rolId: item.rubrica.rolId,
      rolNombre: item.rubrica.rol.nombre,
    }));

    res.status(200).json({ area: area.nombre, rubricas });
  } catch (error) {
    console.error('Error al obtener los detalles del área:', error);
    res.status(500).json({ error: 'Error al obtener los detalles del área', detalles: error.message });
  }
};

const obtenerPorcentajesArea = async (req, res) => {
  const { areaId } = req.params;

  try {
    const area = await prisma.area.findUnique({
      where: { id: parseInt(areaId) },
      select: {
        percentatgeFinalTutor: true,
        percentatgeFinalAvaluadors: true,
      },
    });

    if (!area) {
      return res.status(404).json({ error: 'Área no encontrada' });
    }

    res.status(200).json(area);
  } catch (error) {
    console.error('Error al obtener los porcentajes del área:', error);
    res.status(500).json({ error: 'Error al obtener los porcentajes del área', detalles: error.message });
  }
};

const obtenerPorcentajesAreaPorTrabajo = async (req, res) => {
  const { trabajoId } = req.params;

  try {
    // Buscar trabajo junto con su área
    const trabajo = await prisma.trabajo.findUnique({
      where: { id: parseInt(trabajoId) },
      select: {
        area: {
          select: {
            percentatgeFinalTutor: true,
            percentatgeFinalAvaluadors: true,
          },
        },
      },
    });

    if (!trabajo) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    if (!trabajo.area) {
      return res.status(404).json({ error: 'Área asociada al trabajo no encontrada' });
    }

    res.status(200).json({
      percentatgeFinalTutor: trabajo.area.percentatgeFinalTutor,
      percentatgeFinalAvaluadors: trabajo.area.percentatgeFinalAvaluadors,
    });
  } catch (error) {
    console.error('Error al obtener los porcentajes del área por trabajo:', error);
    res.status(500).json({ error: 'Error al obtener los porcentajes del área', detalles: error.message });
  }
};

module.exports = { editarArea, crearArea, obtenerAreas, eliminarArea, obtenerDetallesArea, obtenerPorcentajesArea,
  obtenerPorcentajesAreaPorTrabajo
 };
