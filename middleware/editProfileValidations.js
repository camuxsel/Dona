const { body } = require('express-validator');
const db = require('../database/models');
const bcrypt = require('bcryptjs');

let editProfileValidations = [
    body('email')
        .notEmpty().withMessage('Por favor, complete el campo email.')
        .isEmail().withMessage('Por favor, ingrese un email válido.'),
    body('nombreUsuario')
        .notEmpty().withMessage('Por favor, complete el campo de nombre de usuario.')
        .isString().withMessage('Por favor, ingrese un nombre de usuario válido, recuerde usar solo texto.'),
    body('password')
        .notEmpty().withMessage('Por favor, complete el campo contraseña.')
        .isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres.'),
    body('codigo')
        .notEmpty().withMessage('Por favor, complete el campo código de seguridad.')
        // validamos que el codigo sea correcto
        .custom(function (value, { req }) {
            const codigoGuardado = '140413';
            // Usamos bcrypt.compareSync para comparar el valor ingresado con el hash
            if (value !== codigoGuardado) {
                throw new Error("El código de seguridad es incorrecto.");
              }
          
            return true; // importante para que pase la validación
        })
];

module.exports = editProfileValidations;


