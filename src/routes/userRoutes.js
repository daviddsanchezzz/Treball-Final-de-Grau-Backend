const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Crear un nuevo usuario
router.post('/usuarios', userController.crearUsuario);


// Iniciar sesión
router.post('/usuarios/login', userController.loginUsuario);

router.post('/usuarios/asignarEvaluador', userController.asignarEvaluadorATrabajo);

// Obtener trabajos de un usuario
router.get('/usuarios/:usuarioId/trabajos', userController.obtenerTrabajosUsuario);

router.get('/usuarios/:usuarioId', userController.obtenerUsuario);

router.get('/usuarios', userController.obtenerUsuarios); // Ruta añadida

router.put('/usuarios/:usuarioId/editar-contrasenya', userController.editarContraseña);

router.put('/usuarios/:usuarioId', userController.editarUsuario);

router.delete('/usuarios/:usuarioId', userController.eliminarUsuario); // Nueva ruta para eliminar un usuario

module.exports = router;
