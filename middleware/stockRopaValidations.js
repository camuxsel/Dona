const { body } = require('express-validator');
const db = require('../database/models');
const bcrypt = require('bcryptjs');

let stockRopaValidations = [
    body('articulo')
        .notEmpty().withMessage('Por favor, complete el campo articulo.')
        .custom(async (value, { req }) => {
            const genero = req.body.genero;
      
            if (!genero) {
              throw new Error('Debe seleccionar un género.');
            }
      
            const existente = await db.StockRopa.findOne({
              where: {
                articulo: value.trim(),
                genero: genero
              },
              paranoid: false
            });
      
            if (existente && !existente.deletedAt) {
              throw new Error('Ya existe un artículo con ese nombre y género.');
            }

            return true;
          }),
      
        body('genero')
          .notEmpty().withMessage('Por favor, seleccione un género.')
];

module.exports = stockRopaValidations;
