const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');

// Crear una nueva nota
router.post('/notas', evaluacionController.crearNota);

// Crear o actualizar evaluación final del evaluador
router.post('/evaluaciones/evaluador', evaluacionController.crearActualizarEvaluacionFinalEvaluador);

// Crear o actualizar evaluación final del tutor
router.post('/evaluaciones/tutor', evaluacionController.crearActualizarEvaluacionFinalTutor);

// Obtener evaluación final del evaluador
router.get('/evaluaciones/evaluador/:trabajoId/:evaluadorId', evaluacionController.obtenerEvaluacionFinalEvaluador);

// Obtener evaluación final del tutor
router.get('/evaluaciones/tutor/:trabajoId/:puntoControlId', evaluacionController.obtenerEvaluacionFinalTutor);

module.exports = router;
