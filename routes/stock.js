const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');

const stockRopaValidations = require('../middleware/stockRopaValidations');
const stockComidaValidations = require('../middleware/stockComidaValidations');

/* Ropa */ 

router.get('/ropa', stockController.ropa);

router.get('/agregar-ropa', stockController.agregarRopa);

router.get('/editar-ropa/:id', stockController.editarRopa);

router.post('/agregar-ropa', stockRopaValidations, stockController.storeRopa);

router.post('/editar-ropa/:id', stockController.actualizarRopa);

router.post('/eliminar-ropa/:idRopa', stockController.eliminarRopa);


/* Talles */ 

router.get('/agregar-talle/:id', stockController.agregarTalle);

router.post('/agregar-talle/:id', stockController.storeTalle);

router.post('/eliminar-talle/:idTalle', stockController.eliminarTalle);


/* Comida */ 

router.get('/comida', stockController.comida);

router.get('/agregar-comida', stockController.agregarComida);

router.get('/editar-comida/:id', stockController.editarComida);

router.get('/agregar-comida', stockController.agregarComida);

router.post('/agregar-comida', stockComidaValidations, stockController.storeComida);

router.post('/editar-comida/:id', stockComidaValidations, stockController.actualizarComida);

router.post('/eliminar-comida/:id', stockController.eliminarComida);






module.exports = router;