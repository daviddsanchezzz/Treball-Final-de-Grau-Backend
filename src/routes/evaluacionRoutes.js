// Importem la llibreria Express
const express = require('express');

// Creem un objecte router per definir les rutes relacionades amb l’avaluació
const router = express.Router();

// Importem el controlador que conté la lògica d’avaluació
const evaluacionController = require('../controllers/evaluacionController');

// Crear una nova nota d’un avaluador
router.post('/notasEvaluador', evaluacionController.crearNotaEvaluador);

// Crear una nova nota d’un tutor
router.post('/notasTutor', evaluacionController.crearNotaTutor);

// Crear o actualitzar l’avaluació final d’un avaluador
router.post('/evaluaciones/evaluador', evaluacionController.crearActualizarEvaluacionFinalEvaluador);

// Crear l’avaluació final del tutor per a un treball i punt de control concret
router.post('/evaluaciones/tutor/:trabajoId/:puntoControlId', evaluacionController.crearEvaluacionFinalTutor);

// Crear o actualitzar l’avaluació final del tutor (versió general)
router.post('/evaluaciones/tutor', evaluacionController.crearActualizarEvaluacionFinalTutor);

// Obtenir l’avaluació final d’un avaluador per a un treball concret
router.get('/evaluaciones/:trabajoId/evaluador/:evaluadorId', evaluacionController.obtenerEvaluacionFinalEvaluador);

// Obtenir totes les notes del tutor i la seva avaluació final per a un treball concret
router.get('/:usuarioId/evaluaciones/:trabajoId/tutor', evaluacionController.obtenerEvaluacionFinalTutorConNotas);

// Obtenir informació detallada d’un treball concret i el seu usuari (avaluador o tutor)
router.get('/trabajo/:trabajoId/usuario/:userId/datos', evaluacionController.obtenerDatosTrabajoUsuario);

// Obtenir la rúbrica adaptada al rol d’avaluador per a un treball concret
router.get('/rubricaEvaluador/:trabajoId', evaluacionController.obtenerRubricaConRolEvaluador);

// Obtenir totes les avaluacions finals fetes pels avaluadors d’un treball concret
router.get('/evaluaciones/evaluadores/:trabajoId', evaluacionController.obtenerEvaluacionesFinalesEvaluadoresDeTrabajo);


// Exportem el router per a ser utilitzat al servidor principal
module.exports = router;
