// Importem la llibreria Express
const express = require('express');

// Creem un router per definir les rutes relacionades amb els usuaris
const router = express.Router();

// Importem el controlador d'usuaris, que conté la lògica de gestió dels usuaris
const userController = require('../controllers/userController');


// Ruta per crear un nou usuari (registre)
router.post('/usuarios', userController.crearUsuario);

// Ruta per iniciar sessió (login d’un usuari)
router.post('/usuarios/login', userController.loginUsuario);

// Ruta per assignar un usuari com a avaluador a un treball
router.post('/usuarios/asignarEvaluador', userController.asignarEvaluadorATrabajo);

// Ruta per obtenir tots els treballs associats a un usuari concret
router.get('/usuarios/:usuarioId/trabajos', userController.obtenerTrabajosUsuario);

// Ruta per obtenir les dades d’un usuari específic segons el seu ID
router.get('/usuarios/:usuarioId', userController.obtenerUsuario);

// Ruta per obtenir la llista de tots els usuaris del sistema
router.get('/usuarios', userController.obtenerUsuarios); // Ruta afegida

// Ruta per editar només la contrasenya d’un usuari
router.put('/usuarios/:usuarioId/editar-contrasenya', userController.editarContraseña);

// Ruta per editar les dades generals d’un usuari (excloent la contrasenya)
router.put('/usuarios/:usuarioId', userController.editarUsuario);

// Ruta per eliminar un usuari del sistema
router.delete('/usuarios/:usuarioId', userController.eliminarUsuario); // Nova ruta per eliminar un usuari

// Exportem el router perquè pugui ser utilitzat en el servidor principal
module.exports = router;
