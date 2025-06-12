const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

// Crear un nuevo área
router.post('/areas', areaController.crearArea);

// Obtener todas las áreas
router.get('/areas', areaController.obtenerAreas);

router.get('/areas/:id', areaController.obtenerDetallesArea);

router.get('/areas/porcentages/:areaId', areaController.obtenerPorcentajesArea);

router.get('/areas/porcentagesTrabajo/:trabajoId', areaController.obtenerPorcentajesAreaPorTrabajo);


router.put('/areas/:id/editar', areaController.editarArea);

router.delete('/areas/:areaId', areaController.eliminarArea);


module.exports = router;
