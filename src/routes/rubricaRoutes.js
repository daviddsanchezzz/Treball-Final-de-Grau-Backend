const express = require('express');
const router = express.Router();
const rubricaController = require('../controllers/rubricaController');

// Crear una nueva rúbrica
router.post('/rubricas', rubricaController.crearRubrica);



// Crear un nuevo criterio
router.post('/criterios', rubricaController.crearCriterio);

// Asignar una rúbrica a un área
router.post('/rubricas/asignar', rubricaController.asignarRubricaAArea);

router.get('/rubricas', rubricaController.obtenerRubricas);

router.get('/rubricas/:rubricaId', rubricaController.obtenerRubrica);

// Obtener los puntos de control por rúbrica
router.get('/rubricas/:rubricaId/puntosDeControl', rubricaController.obtenerPuntosDeControlPorRubrica);

router.get('/areas/:areaId/rubricas', rubricaController.obtenerRubricasPorArea);

router.get('/criterios/:rubricaId', rubricaController.obtenerCriteriosConPuntosControl);

router.get('/criterios/:rubricaId/puntoControl', rubricaController.obtenerCriteriosConPuntosDeControlPorRubrica);

// Actualizar peso de un punto de control
router.put('/puntosDeControl/actualizarPeso', rubricaController.actualizarPesoPuntoControl);

router.put('/rubricas/:rubricaId', rubricaController.editarRubrica);

router.put('/criterios/:criterioId', rubricaController.editarCriterio);

router.put('/puntos-de-control/:id', rubricaController.editarPuntoDeControl);

router.delete('/rubricas/desasignar', rubricaController.desasignarRubricaAArea);

router.delete('/criterios/:criterioId', rubricaController.eliminarCriterio);


router.delete('/rubricas/:rubricaId', rubricaController.eliminarRubrica);

module.exports = router;
