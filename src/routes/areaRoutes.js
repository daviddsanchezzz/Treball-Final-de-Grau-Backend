// Importem la llibreria Express
const express = require('express');

// Creem un objecte router per definir les rutes relacionades amb l’entitat "àrea"
const router = express.Router();

// Importem el controlador que conté la lògica de negoci per a les àrees
const areaController = require('../controllers/areaController');


// Ruta per crear una nova àrea (mètode POST)
router.post('/areas', areaController.crearArea);

// Ruta per obtenir totes les àrees disponibles (mètode GET)
router.get('/areas', areaController.obtenerAreas);

// Ruta per obtenir els detalls d’una àrea concreta segons el seu ID (mètode GET)
router.get('/areas/:id', areaController.obtenerDetallesArea);

// Ruta per obtenir els percentatges associats a una àrea (per exemple, pesos dels punts de control o criteris)
router.get('/areas/porcentages/:areaId', areaController.obtenerPorcentajesArea);

// Ruta per obtenir els percentatges associats a un treball concret, a partir de la seva àrea
router.get('/areas/porcentagesTrabajo/:trabajoId', areaController.obtenerPorcentajesAreaPorTrabajo);

// Ruta per editar una àrea concreta segons el seu ID (mètode PUT)
router.put('/areas/:id/editar', areaController.editarArea);

// Ruta per eliminar una àrea segons el seu ID (mètode DELETE)
router.delete('/areas/:areaId', areaController.eliminarArea);


// Exportem el router perquè es pugui utilitzar al fitxer principal del servidor
module.exports = router;
