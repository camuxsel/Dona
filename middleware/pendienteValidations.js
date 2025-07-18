const { body } = require('express-validator');
const db = require('../database/models');

let pendienteValidations = [
    body('nombre_solicitante')
        .notEmpty().withMessage('Por favor, complete el campo nombre del solicitante.'),
    body('siervo_encargado')
        .notEmpty().withMessage('Por favor, complete el campo siervo encargado.'),
    body('necesidad')
        .notEmpty().withMessage('Por favor, complete el campo necesidad.'),
    body('direccion')
        .notEmpty().withMessage('Por favor, complete el campo dirección.'),
];

module.exports = pendienteValidations;
