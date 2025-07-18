const { body } = require('express-validator');
const db = require('../database/models');

let stockRopaValidations = [
    body('articulo')
        .notEmpty().withMessage('Por favor, complete el campo articulo.')
        .custom(async (value) => {
            const existente = await db.StockComida.findOne({
              where: {
                articulo: value.trim()
              },
              paranoid: false
            });
      
            if (existente && !existente.deletedAt) {
              throw new Error('Ya existe un artículo con ese nombre.');
            }
      
            return true;
          }),
    body('cantidad')
        .notEmpty().withMessage('Por favor, complete el campo cantidad.'),
    body('fecha_vencimiento')
        .notEmpty().withMessage('Por favor, complete el campo fecha de vencimiento.')
         
];

module.exports = stockRopaValidations;
