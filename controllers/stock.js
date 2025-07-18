const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const db = require('../database/models');

const stockController = {
    ropa: function (req, res) {
        if (req.session.user !== undefined) {
            db.StockRopa.findAll({include: [{ model: db.TallesRopa, as: 'talles' }]})
            .then(function (ropa) {
                // return res.send(ropa);
                return res.render('stockRopa', { ropa: ropa })
            })
            .catch(function (e) {
                console.log(e);
            })       
        } else {
            return res.redirect('/');
        }
    },
    comida: function (req, res) {
        if (req.session.user !== undefined) {
            db.StockComida.findAll()
            .then( function (comida) {
                // return res.send(comida);
                return res.render('stockComida', { comida: comida })
            })
            .catch(function (e) {
                console.log(e);
            })  
        } else {
            return res.redirect('/');
        }
    },
    agregarRopa: function (req, res) {
        if (req.session.user !== undefined) {
            return res.render('agregarRopa');
        } else {
            return res.redirect('/');
        }
    },
    agregarComida: function (req, res) {
        if (req.session.user !== undefined) {
            return res.render('agregarComida');
        } else {
            return res.redirect('/');
        }
    },
    storeRopa: function (req, res) {
        let errors = validationResult(req);
        console.log(errors);

        if (errors.isEmpty()) {
            // avanzamos con el controlador de manera normal, no hay errores
            db.StockRopa.create({
                articulo: req.body.articulo,
                genero: req.body.genero,
                categoria: req.body.categoria
            })
            .then(() => {
                return res.redirect('/stock/ropa');
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            // hay errores, volvemos al formulario mostrando los errores
            return res.render('agregarRopa', { errors: errors.mapped(), old: req.body })
        }

        // res.send(req.body);
    },
    editarRopa: function (req, res) {
        if (req.session.user !== undefined) {
            const id = req.params.id;

            db.StockRopa.findByPk(id, {
                include: [{ model: db.TallesRopa, as: 'talles' }]
            })
                .then(articulo => {
                    if (!articulo) return res.redirect('/stock/ropa');
                    return res.render('editarRopa', { articulo: articulo });
                })
                .catch(err => {
                    console.log(err);
                    res.send("Error al cargar el artículo");
                });
        } else {
            return res.redirect('/');
        }
    },
    agregarTalle: function (req, res) {
        if (req.session.user !== undefined) {
            const id = req.params.id;

        db.StockRopa.findByPk(id, {
            include: [{ model: db.TallesRopa, as: 'talles' }]
        })
            .then(articulo => {
                if (!articulo) return res.redirect('/stock/ropa');
                return res.render('agregarTalle', { articulo: articulo });
            })
            .catch(err => {
                console.log(err);
                res.send("Error al cargar el artículo");
            });
        } else {
            return res.redirect('/');
        }
    },
    actualizarRopa: function (req, res) {
        const id = req.params.id;
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            // No hay errores, avanzamos con el código normal
            db.StockRopa.update({
                articulo: req.body.articulo,
                genero: req.body.genero,
                categoria: req.body.categoria
            }, {
                where: { id }
            });
        // Procesar talles 
        const talles = req.body.talles;
        const cantidades = req.body.cantidades;
        const ids = req.body.talle_id;

        // return res.send(req.body)
        if (talles) {
            for (let i = 0; i < talles.length; i++) {
                let talle = talles[i];
                let cantidad = cantidades[i];
                let talleId = ids[i];
    
                if (talleId && talleId !== '') {
                    // Existe: actualizamos
                    db.TallesRopa.update({
                        talle: talle,
                        cantidad: cantidad
                    }, {
                        where: {
                            id: talleId,
                            ropa_id: id
                        }
                    });
                } else {
                    console.log('Error al actualizar el talle');
                }
            }
        }
        
        return res.redirect('/stock/ropa');

        } else {
            // si hay errores, volvemos al form mostrando los errores
            db.StockRopa.findByPk(id, {
                include: [{ model: db.TallesRopa, as: 'talles' }]
            })
                .then(function (ropa) {
                    //return res.send(errors.mapped())
                    return res.render('editarRopa', { ropa: ropa, errors: errors.mapped(), old: req.body });
                })
                .catch(function (e) {
                    console.log(e);
                })
        }
    },
    storeTalle: function (req, res) {
        const id = req.params.id;

        db.TallesRopa.create({
            talle: req.body.talle,
            cantidad: req.body.cantidad,
            ropa_id: id
        });
        return res.redirect('/stock/ropa');
    },
    eliminarRopa: function (req, res) {
        let idRopa = req.params.idRopa;

        db.StockRopa.findByPk(idRopa)
            .then(function (ropa) {
                //return res.send(ropa);
                db.StockRopa.destroy({
                    where: {
                        id: ropa.id
                    }
                })
                return res.redirect('/stock/ropa')
            }
            )
            .catch(function (e) {
                console.log(e);
            })
    },
    eliminarTalle: function (req, res) {
        let idTalle = req.params.idTalle;

        db.TallesRopa.findByPk(idTalle)
            .then(function (talle) {
                // return res.send(talle);
                db.TallesRopa.destroy({
                    where: {
                        id: talle.id
                    }
                })
                return res.redirect(`/stock/editar-ropa/${talle.ropa_id}`)
            }
            )
            .catch(function (e) {
                console.log(e);
            })
    },
    storeComida: function (req, res) {
        let errors = validationResult(req);
        console.log(errors);

        if (errors.isEmpty()) {
            // avanzamos con el controlador de manera normal, no hay errores
            db.StockComida.create({
                articulo: req.body.articulo,
                cantidad: req.body.cantidad,
                observaciones: req.body.observaciones,
                fecha_vencimiento: req.body.fecha_vencimiento
            })
            .then(() => {
                return res.redirect('/stock/comida');
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            // hay errores, volvemos al formulario mostrando los errores
            return res.render('agregarComida', { errors: errors.mapped(), old: req.body })
        }

        // res.send(req.body);
    },
    editarComida: function (req, res) {
        if (req.session.user !== undefined) {
            const id = req.params.id;

            db.StockComida.findByPk(id)
                .then(articulo => {
                    if (!articulo) return res.redirect('/stock/comida');
                    return res.render('editarComida', { articulo: articulo });
                })
                .catch(err => {
                    console.log(err);
                    res.send("Error al cargar el artículo");
                });
        } else {
            return res.redirect('/');
        }
    },
    actualizarComida: function (req, res) {
        const id = req.params.id;
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            // No hay errores, avanzamos con el código normal
            db.StockComida.update({
                articulo: req.body.articulo,
                cantidad: req.body.cantidad,
                observaciones: req.body.observaciones,
                fecha_vencimiento: req.body.fecha_vencimiento
            }, {
                where: { id }
            });
            return res.redirect('/stock/comida');

        } else {
            // si hay errores, volvemos al form mostrando los errores
            db.StockComida.findByPk(id)
                .then(function (comida) {
                    //return res.send(errors.mapped())
                    return res.render('editarComida', { comida: comida, errors: errors.mapped(), old: req.body });
                })
                .catch(function (e) {
                    console.log(e);
                })
        }
    },
    eliminarComida: function (req, res) {
        let id = req.params.id;

        db.StockComida.findByPk(id)
            .then(function (articulo) {
                //return res.send(articulo);
                db.StockComida.destroy({
                    where: {
                        id: articulo.id
                    }
                })
                return res.redirect('/stock/comida')
            }
            )
            .catch(function (e) {
                console.log(e);
            })
    }
}

module.exports = stockController;
