const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');

// Crear un nuevo trabajo
router.post('/trabajos', trabajoController.crearTrabajo);

// Asignar un evaluador a un trabajo
router.post('/trabajos/asignarEvaluador', trabajoController.asignarEvaluador);

router.get('/trabajos', trabajoController.obtenerTrabajos);

router.get('/trabajos/:id', trabajoController.obtenerTrabajo);

router.get('/trabajos/:trabajoId/evaluadores', trabajoController.obtenerNombreEvaluadores);

router.get('/trabajos/estados', trabajoController.obtenerEstadosDisponibles);

router.put('/trabajos/:trabajoId/estados', trabajoController.cambiarEstadoTrabajo);


router.put('/trabajos/:id', trabajoController.editarTrabajo);

router.put('/trabajos/editarNotaTutor/:trabajoId', trabajoController.actualizarNotaFinalTutor);
router.put('/trabajos/resetearNotaTutor/:trabajoId', trabajoController.resetearNotaFinalTutor);
router.get('/trabajos/nota-final-tutor/:trabajoId', trabajoController.obtenerNotaFinalTutor);

router.put('/trabajos/actualizarNotas/:trabajoId', trabajoController.actualizarNotasTrabajo);


router.delete('/trabajos/:id', trabajoController.eliminarTrabajo);

router.delete('/trabajos/:id/evaluador/:evaluadorId', trabajoController.eliminarEvaluador);

module.exports = router;
