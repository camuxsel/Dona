const express = require('express');
const router = express.Router();

const donacionesController = require('../controllers/donaciones');

const pendienteValidations = require('../middleware/pendienteValidations');
const donacionValidations = require('../middleware/donacionValidations');



router.get('/pendientes', donacionesController.pendientes);

router.get('/realizadas', donacionesController.realizadas);

router.get('/agregar-pedido', donacionesController.nuevoPendiente);

router.get('/editar-pedido/:id', donacionesController.editarPendiente);

router.get('/agregar-donacion', donacionesController.nuevaDonacion);

router.get('/editar-donacion/:id', donacionesController.editarDonacion);

router.post('/editar-pedido/:id', pendienteValidations, donacionesController.actualizarPendiente);

router.post('/agregar-pedido', pendienteValidations, donacionesController.storePendiente);

router.post('/eliminar-pendiente/:id', donacionesController.eliminarPendiente);

router.post('/completar-pendiente/:id', donacionesController.completarPendiente);

router.post('/agregar-donacion', donacionValidations, donacionesController.storeDonacion);

router.post('/editar-donacion/:id', donacionesController.updateDonacion);

router.post('/eliminar-donacion/:id', donacionesController.eliminarDonacion);




module.exports = router;