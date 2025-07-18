const { body } = require('express-validator');
const db = require('../database/models');

let pendienteValidations = [
    body('beneficiario')
        .notEmpty().withMessage('Por favor, complete el campo nombre del beneficiario.')
];

module.exports = pendienteValidations;
