const { body } = require('express-validator');
const db = require('../database/models');
const bcrypt = require('bcryptjs');

let loginValidations = [
    body('email')
        .notEmpty().withMessage('Por favor, complete el campo email.')
        .isEmail().withMessage('Por favor, ingrese un email válido.')
        .custom(function (value, { req }) {
            // validar que el email exista en la base de datos
            return db.Usuarios.findOne({
                where: { email: value }
            })
                .then(function (user) {
                    if (!user) {
                        throw new Error("El email no se encuentra registrado.")
                    }
                })
        }),
    body('password')
        .notEmpty().withMessage('Por favor, complete el campo contraseña.')
        // validamos que la contraseña sea correcta
        .custom(function (value, { req }) {
            return db.Usuarios.findOne({
                where: { email: req.body.email }
            })
                .then(function (user) {
                    if (user && !bcrypt.compareSync(value, user.contrasena)) {
                        throw new Error("La contraseña es incorrecta.")
                    }
                })
        })
];

module.exports = loginValidations;
