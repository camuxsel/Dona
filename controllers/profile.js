const db = require('../database/models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const profileController = {
    register: function (req, res) {
        console.log(req.session);
        if (req.session.user !== undefined) {
            return res.redirect('/');
        } else {
            return res.render('register');
        }
    },
    store: function (req, res) {
        let errors = validationResult(req);
        console.log(errors);
        if (errors.isEmpty()) {
            // avanzamos con el controlador de manera normal, no hay errores
            db.Usuarios.create({
                nombreUsuario: req.body.nombreUsuario,
                email: req.body.email,
                contrasena: bcrypt.hashSync(req.body.password, 10),
                rol: req.body.rol
            })
            .then(() => {
                return res.redirect('/');
            })
            .catch((err) => {
                console.log(err);
                return res.send("Error al registrar el usuario");
            });
        } else {
            // hay errores, volvemos al formulario mostrando los errores
            return res.render('register', { errors: errors.mapped(), old: req.body })
        }

        // res.send(req.body);
    },
    login: function (req, res) {
        if (req.session.user !== undefined) {
            return res.redirect('/');
        } else {
            return res.render('login');
        }
    },
    processLogin: function (req, res) {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            // No hay errores, avanzamos con el código normal
            db.Usuarios.findOne({
                where: [{ email: req.body.email }]
            })
                .then(function (usuarioLogueado) {
                    // return res.send(usuarioLogueado)
                    // lo ponemos en session
                    req.session.user = {
                        email: usuarioLogueado.email,
                        userName: usuarioLogueado.nombreUsuario,
                        id: usuarioLogueado.id
                    }
                    //console.log(user);

                    //Preguntar si el usuario tildó el checkbox para recordarlo --> cookies
                    if (req.body.recordar !== undefined) {
                        res.cookie('usuarioGuardado', req.session.user, { maxAge: 1000 * 60 * 1000000 });
                    };

                    return res.redirect('/');
                })
                .catch(function (e) {
                    console.log(e);
                })
        } else {
            // Si hay errores, volvemos al formulario con los mensajes
            return res.render('index', { errors: errors.mapped(), old: req.body });
        }
    },
    logout: function (req, res) {
        // destruimos la session
        req.session.destroy();
        // destruimos la cookie
        res.clearCookie('usuarioGuardado');
        //redirigimos al usuario al inicio
        return res.redirect('/')
    },
    profile: function (req, res) {
        let idUsuario = req.params.id;
        db.Usuarios.findByPk(idUsuario)
            .then(function (usuario) {
                return res.render('profile', { usuario: usuario });
            })
            .catch(function (e) {
                console.log(e);
            })
    },
    profileEdit: function (req, res) {
        let idUsuario = req.params.id;

        db.Usuarios.findByPk(idUsuario)
            .then(function (usuario) {
                //return res.send(usuario);
                if (req.session.user && req.session.user.id === usuario.id) {
                    return res.render('profileEdit', { usuario: usuario });
                } else {
                    return res.redirect('/');
                }
            })
            .catch(function (e) {
                console.log(e);
            })
    },
    editProcess: function (req, res) {
        let errors = validationResult(req);

        let idUsuario = req.params.id;

        //return res.send(req.body);

        if (errors.isEmpty()) {
            db.Usuarios.update({
                email: req.body.email,
                nombreUsuario: req.body.nombreUsuario,
                rol: req.body.rol,
                contrasena: bcrypt.hashSync(req.body.password, 10)
            },
                {
                    where: {
                        id: idUsuario
                    }
                })

            return res.redirect('/');
        } else {
            db.Usuarios.findByPk(idUsuario)
                .then(function (usuario) {
                    return res.render('profileEdit', { usuario: usuario, errors: errors.mapped(), old: req.body });
                })
                .catch(function (e) {
                    console.log(e);
                })
        }
    }
};


module.exports = profileController;
