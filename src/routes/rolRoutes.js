// Importem la llibreria Express
const express = require('express');

// Creem un objecte router per definir les rutes relacionades amb els rols
const router = express.Router();

// Importem el controlador que conté la lògica de gestió de rols
const rolController = require('../controllers/rolController');


// Ruta per crear un nou rol (mètode POST)
router.post('/roles', rolController.crearRol);

// Ruta per assignar un rol a un usuari dins d’un treball concret (mètode POST)
router.post('/roles/asignar', rolController.asignarRolAUsuarioEnTrabajo);

// Ruta per obtenir tots els rols del sistema (mètode GET)
router.get('/roles', rolController.obtenerRoles);

// Ruta per obtenir un rol concret segons el seu ID (mètode GET)
router.get('/roles/:id', rolController.obtenerRol);

// Ruta per eliminar un rol concret segons el seu ID (mètode DELETE)
router.delete('/roles/:id', rolController.eliminarRol);


// Exportem el router perquè es pugui utilitzar des del servidor principal
module.exports = router;
