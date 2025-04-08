const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

// Crear un nuevo rol
router.post('/roles', rolController.crearRol);

// Asignar un rol a un usuario en un trabajo
router.post('/roles/asignar', rolController.asignarRolAUsuarioEnTrabajo);

// Obtener todos los roles
router.get('/roles', rolController.obtenerRoles);

router.get('/roles/:id', rolController.obtenerRol);



router.delete('/roles/:id', rolController.eliminarRol);



module.exports = router;
