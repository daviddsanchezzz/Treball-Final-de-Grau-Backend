const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');

// Crear una nueva nota
router.post('/notasEvaluador', evaluacionController.crearNotaEvaluador);

router.post('/notasTutor', evaluacionController.crearNotaTutor);


// Crear o actualizar evaluación final del evaluador
router.post('/evaluaciones/evaluador', evaluacionController.crearActualizarEvaluacionFinalEvaluador);

router.post('/evaluaciones/tutor/:trabajoId/:puntoControlId', evaluacionController.crearEvaluacionFinalTutor);

// Crear o actualizar evaluación final del tutor
router.post('/evaluaciones/tutor', evaluacionController.crearActualizarEvaluacionFinalTutor);

// Obtener evaluación final del evaluador
router.get('/evaluaciones/:trabajoId/evaluador/:evaluadorId', evaluacionController.obtenerEvaluacionFinalEvaluador);

// Obtener evaluación final del tutor
router.get('/:usuarioId/evaluaciones/:trabajoId/tutor', evaluacionController.obtenerEvaluacionFinalTutorConNotas);

router.get('/trabajo/:trabajoId/usuario/:userId/datos', evaluacionController.obtenerDatosTrabajoUsuario);

router.get('/rubricaEvaluador/:trabajoId', evaluacionController.obtenerRubricaConRolEvaluador);

router.get('/evaluaciones/evaluadores/:trabajoId', evaluacionController.obtenerEvaluacionesFinalesEvaluadoresDeTrabajo);


module.exports = router;
