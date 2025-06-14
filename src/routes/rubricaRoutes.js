// Importem la llibreria Express
const express = require('express');

// Creem un router per definir les rutes relacionades amb les rúbriques
const router = express.Router();

// Importem el controlador que conté la lògica de gestió de rúbriques i criteris
const rubricaController = require('../controllers/rubricaController');

// Ruta per crear una nova rúbrica
router.post('/rubricas', rubricaController.crearRubrica);

// Ruta per crear un nou criteri associat a una rúbrica
router.post('/criterios', rubricaController.crearCriterio);

// Ruta per assignar una rúbrica a una àrea
router.post('/rubricas/asignar', rubricaController.asignarRubricaAArea);

// Ruta per obtenir totes les rúbriques
router.get('/rubricas', rubricaController.obtenerRubricas);

// Ruta per obtenir una rúbrica concreta pel seu ID
router.get('/rubricas/:rubricaId', rubricaController.obtenerRubrica);

// Ruta per obtenir els punts de control associats a una rúbrica
router.get('/rubricas/:rubricaId/puntosDeControl', rubricaController.obtenerPuntosDeControlPorRubrica);

// Ruta per obtenir totes les rúbriques associades a una àrea concreta
router.get('/areas/:areaId/rubricas', rubricaController.obtenerRubricasPorArea);

// Ruta per obtenir els criteris d’una rúbrica amb els seus punts de control associats
router.get('/criterios/:rubricaId', rubricaController.obtenerCriteriosConPuntosControl);

// Ruta alternativa per obtenir els criteris d’una rúbrica i els seus punts de control
router.get('/criterios/:rubricaId/puntoControl', rubricaController.obtenerCriteriosConPuntosDeControlPorRubrica);

// Ruta per actualitzar el pes d’un punt de control associat a un criteri
router.put('/puntosDeControl/actualizarPeso', rubricaController.actualizarPesoPuntoControl);

// Ruta per editar una rúbrica
router.put('/rubricas/:rubricaId', rubricaController.editarRubrica);

// Ruta per editar un criteri concret
router.put('/criterios/:criterioId', rubricaController.editarCriterio);

// Ruta per editar un punt de control concret
router.put('/puntos-de-control/:id', rubricaController.editarPuntoDeControl);

// Ruta per desassignar una rúbrica d’una àrea
router.delete('/rubricas/desasignar', rubricaController.desasignarRubricaAArea);

// Ruta per eliminar un criteri concret
router.delete('/criterios/:criterioId', rubricaController.eliminarCriterio);

// Ruta per eliminar una rúbrica concreta
router.delete('/rubricas/:rubricaId', rubricaController.eliminarRubrica);

// Exportem el router per poder-lo utilitzar des del servidor principal
module.exports = router;
