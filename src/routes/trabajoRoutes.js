// Importem la llibreria Express
const express = require('express');

// Creem un router per definir les rutes relacionades amb els treballs
const router = express.Router();

// Importem el controlador que conté la lògica de gestió de treballs
const trabajoController = require('../controllers/trabajoController');


// Ruta per crear un nou treball (mètode POST)
router.post('/trabajos', trabajoController.crearTrabajo);

// Ruta per assignar un avaluador a un treball específic
router.post('/trabajos/asignarEvaluador', trabajoController.asignarEvaluador);

// Ruta per obtenir tots els treballs registrats
router.get('/trabajos', trabajoController.obtenerTrabajos);

// Ruta per obtenir un treball concret segons el seu ID
router.get('/trabajos/:id', trabajoController.obtenerTrabajo);

// Ruta per obtenir el nom dels avaluadors associats a un treball concret
router.get('/trabajos/:trabajoId/evaluadores', trabajoController.obtenerNombreEvaluadores);

// Ruta per obtenir els estats disponibles per a un treball (per exemple: pendent, revisat, etc.)
router.get('/trabajos/estados', trabajoController.obtenerEstadosDisponibles);

// Ruta per canviar l’estat d’un treball (mètode PUT)
router.put('/trabajos/:trabajoId/estados', trabajoController.cambiarEstadoTrabajo);

// Ruta per editar la informació d’un treball concret
router.put('/trabajos/:id', trabajoController.editarTrabajo);

// Ruta per actualitzar la nota final del tutor per a un treball
router.put('/trabajos/editarNotaTutor/:trabajoId', trabajoController.actualizarNotaFinalTutor);

// Ruta per reiniciar (eliminar) la nota final del tutor d’un treball
router.put('/trabajos/resetearNotaTutor/:trabajoId', trabajoController.resetearNotaFinalTutor);

// Ruta per obtenir la nota final del tutor per a un treball concret
router.get('/trabajos/nota-final-tutor/:trabajoId', trabajoController.obtenerNotaFinalTutor);

// Ruta per actualitzar totes les notes d’un treball (pot incloure criteris i puntuacions)
router.put('/trabajos/actualizarNotas/:trabajoId', trabajoController.actualizarNotasTrabajo);

// Ruta per eliminar un treball específic del sistema
router.delete('/trabajos/:id', trabajoController.eliminarTrabajo);

// Ruta per eliminar un avaluador concret d’un treball específic
router.delete('/trabajos/:id/evaluador/:evaluadorId', trabajoController.eliminarEvaluador);


// Exportem el router perquè pugui ser utilitzat des del fitxer principal del servidor
module.exports = router;
