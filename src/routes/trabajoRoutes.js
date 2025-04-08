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

router.put('/trabajos/:id', trabajoController.editarTrabajo);



router.delete('/trabajos/:id', trabajoController.eliminarTrabajo);

router.delete('/trabajos/:id/evaluador/:evaluadorId', trabajoController.eliminarEvaluador);

module.exports = router;
