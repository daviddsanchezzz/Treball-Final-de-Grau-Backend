// Importem PrismaClient per accedir a la base de dades
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Crear una nova àrea
const crearArea = async (req, res) => {
  const { nombre, tutor, avaluador } = req.body;

  try {
    // Creem l'àrea amb el nom i els percentatges proporcionats
    const nuevaArea = await prisma.area.create({
      data: {
        nombre,
        percentatgeFinalTutor: parseFloat(tutor),
        percentatgeFinalAvaluadors: parseFloat(avaluador),
      },
    });

    // Retornem l'àrea creada amb codi 201 (creat correctament)
    res.status(201).json(nuevaArea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en crear l\'àrea', detalles: error.message });
  }
};


// Editar una àrea existent
const editarArea = async (req, res) => {
  const { areaId, nombre, tutor, avaluador } = req.body;

  try {
    // Verifiquem si l'àrea existeix
    const areaExistente = await prisma.area.findUnique({ where: { id: parseInt(areaId) } });

    if (!areaExistente) {
      return res.status(404).json({ error: 'Àrea no trobada' });
    }

    // Actualitzem l'àrea amb les dades noves
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
    res.status(500).json({ error: 'Error en editar l\'àrea', detalles: error.message });
  }
};


// Obtenir totes les àrees
const obtenerAreas = async (req, res) => {
  try {
    const areas = await prisma.area.findMany();  // Obtenim totes les àrees de la base de dades
    res.status(200).json(areas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en obtenir les àrees', detalles: error.message });
  }
};


// Eliminar una àrea
const eliminarArea = async (req, res) => {
  const { areaId } = req.params;

  try {
    // Comprovem si l'àrea existeix
    const areaExistente = await prisma.area.findUnique({ where: { id: parseInt(areaId) } });

    if (!areaExistente) {
      return res.status(404).json({ error: 'Àrea no trobada' });
    }

    // Eliminem l'àrea
    await prisma.area.delete({ where: { id: parseInt(areaId) } });

    res.status(200).json({ message: 'Àrea eliminada correctament' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en eliminar l\'àrea', detalles: error.message });
  }
};


// Obtenir els detalls d'una àrea i les seves rúbriques amb els rols associats
const obtenerDetallesArea = async (req, res) => {
  const { id } = req.params;  // L'ID de l'àrea des de la URL

  try {
    // Busquem l'àrea i les seves rúbriques, incloent el rol de cada rúbrica
    const area = await prisma.area.findUnique({
      where: { id: parseInt(id) },
      include: {
        areaRubrica: {
          include: {
            rubrica: {
              include: {
                rol: true,
              },
            },
          },
        },
      },
    });

    if (!area) {
      return res.status(404).json({ message: 'Àrea no trobada' });
    }

    // Transformem les dades de les rúbriques per retornar-les amb els noms de rol
    const rubricas = area.areaRubrica.map((item) => ({
      rubrica: item.rubrica.nombre,
      rubricaId: item.rubrica.id,
      rolId: item.rubrica.rolId,
      rolNombre: item.rubrica.rol.nombre,
    }));

    res.status(200).json({ area: area.nombre, rubricas });
  } catch (error) {
    console.error('Error en obtenir els detalls de l\'àrea:', error);
    res.status(500).json({ error: 'Error en obtenir els detalls de l\'àrea', detalles: error.message });
  }
};


// Obtenir els percentatges finals d’una àrea (tutor i avaluadors)
const obtenerPorcentajesArea = async (req, res) => {
  const { areaId } = req.params;

  try {
    // Cerquem només els percentatges de l'àrea
    const area = await prisma.area.findUnique({
      where: { id: parseInt(areaId) },
      select: {
        percentatgeFinalTutor: true,
        percentatgeFinalAvaluadors: true,
      },
    });

    if (!area) {
      return res.status(404).json({ error: 'Àrea no trobada' });
    }

    res.status(200).json(area);
  } catch (error) {
    console.error('Error en obtenir els percentatges de l\'àrea:', error);
    res.status(500).json({ error: 'Error en obtenir els percentatges de l\'àrea', detalles: error.message });
  }
};


// Obtenir els percentatges d'una àrea a partir de l'ID del treball associat
const obtenerPorcentajesAreaPorTrabajo = async (req, res) => {
  const { trabajoId } = req.params;

  try {
    // Cerquem el treball amb la seva àrea associada
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
      return res.status(404).json({ error: 'Treball no trobat' });
    }

    if (!trabajo.area) {
      return res.status(404).json({ error: 'Àrea associada no trobada' });
    }

    // Retornem els percentatges finals de tutor i avaluadors
    res.status(200).json({
      percentatgeFinalTutor: trabajo.area.percentatgeFinalTutor,
      percentatgeFinalAvaluadors: trabajo.area.percentatgeFinalAvaluadors,
    });
  } catch (error) {
    console.error('Error en obtenir els percentatges per treball:', error);
    res.status(500).json({ error: 'Error en obtenir els percentatges de l\'àrea', detalles: error.message });
  }
};


// Exportem totes les funcions per poder utilitzar-les en altres fitxers (com les rutes)
module.exports = { 
  editarArea, 
  crearArea, 
  obtenerAreas, 
  eliminarArea, 
  obtenerDetallesArea, 
  obtenerPorcentajesArea,
  obtenerPorcentajesAreaPorTrabajo
};
