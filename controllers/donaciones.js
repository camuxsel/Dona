const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const db = require('../database/models');

const donacionesController = {
    pendientes: function (req, res) {
        if (req.session.user !== undefined) {
            db.PedidosPendientes.findAll()
            .then(function (pedidosPendientes) {
                // return res.send(pedidos);
                let pendientes = []
                for (let i = 0; i < pedidosPendientes.length; i++) {
                    if (pedidosPendientes[i].estado != 'Completado') {
                        pendientes.push(pedidosPendientes[i])
                    }   
                }
                return res.render('pendientes', { pendientes: pendientes })
            })
            .catch(function (e) {
                console.log(e);
            })       
        } else {
            return res.redirect('/');
        }
    },
    realizadas: function (req, res) {
        if (req.session.user !== undefined) {
            db.Donaciones.findAll({include: [{ model: db.DonacionItem, as: 'items' }]})
            .then(function(donaciones) {
                //return res.send(donaciones)
                return res.render('realizadas', {donaciones: donaciones})
            })
            .catch(function (e) {
                console.log(e);
            })
        } else {
            return res.redirect('/');
        }
    },
    nuevoPendiente: function (req, res) {
        if (req.session.user !== undefined) {
            return res.render('agregarPendiente')     
        } else {
            return res.redirect('/');
        }
    },
    storePendiente: function (req, res) {
        let errors = validationResult(req);
        console.log(errors);

        if (errors.isEmpty()) {
            // avanzamos con el controlador de manera normal, no hay errores
            // return res.send(req.body)
            db.PedidosPendientes.create({
                nombre_solicitante: req.body.nombre_solicitante,
                siervo_encargado: req.body.siervo_encargado,
                categoria: req.body.categoria,
                necesidad: req.body.necesidad,
                direccion: req.body.direccion
            })
            .then(() => {
                return res.redirect('/donaciones/pendientes');
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            // hay errores, volvemos al formulario mostrando los errores
            return res.render('agregarPendiente', { errors: errors.mapped(), old: req.body })
        }
        // res.send(req.body);
    },
    eliminarPendiente: function (req, res) {
        let idPendiente = req.params.id;
        db.PedidosPendientes.findByPk(idPendiente)
            .then(function (pedido) {
                //return res.send(pedido);
                db.PedidosPendientes.destroy({
                    where: {
                        id: pedido.id
                    }
                })
                return res.redirect('/donaciones/pendientes')
            }
            )
            .catch(function (e) {
                console.log(e);
            })
    },
    editarPendiente: function (req, res) {
        if (req.session.user !== undefined) {
            const id = req.params.id;

            db.PedidosPendientes.findByPk(id)
                .then(pendiente => {
                    if (!pendiente) return res.redirect('/donaciones/pendientes');
                    return res.render('editarPendiente', { pendiente: pendiente });
                })
                .catch(err => {
                    console.log(err);
                    res.send("Error al cargar el pedido");
                });
        } else {
            return res.redirect('/');
        }
    },
    actualizarPendiente: function (req, res) {
        const id = req.params.id;
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            // No hay errores, avanzamos con el código normal
            // return res.send(req.body)
            db.PedidosPendientes.update({
                nombre_solicitante: req.body.nombre_solicitante,
                siervo_encargado: req.body.siervo_encargado,
                categoria: req.body.categoria,
                necesidad: req.body.necesidad,
                direccion: req.body.direccion
            }, {
                where: { id }
            });
        
        return res.redirect('/donaciones/pendientes');

        } else {
            // si hay errores, volvemos al form mostrando los errores
            db.PedidosPendientes.findByPk(id)
                .then(function (pendiente) {
                    //return res.send(errors.mapped())
                    return res.render('editarPendiente', { pendiente: pendiente, errors: errors.mapped(), old: req.body });
                })
                .catch(function (e) {
                    console.log(e);
                })
        }
    },
    completarPendiente: function (req, res) {
        const id = req.params.id;

        db.PedidosPendientes.update({
            estado: 'Completado'
        }, {
            where: { id }
        });

        return res.redirect('/donaciones/pendientes');
    },
    nuevaDonacion: function (req, res) {
        if (req.session.user !== undefined) {
            db.StockRopa.findAll({
                include: [{ model: db.TallesRopa, as: 'talles' }]
              })
              .then(function (stockRopa) {
                db.StockComida.findAll()
                  .then(function (stockComida) {
                    //return res.send(stockRopa)
                    return res.render('agregarDonacion', {
                      stockRopa: stockRopa,
                      stockComida: stockComida
                    });
                  })
                  .catch(function (err) {
                    console.log(err);
                    return res.send("Error al cargar el stock de comida");
                  });
              })
              .catch(function (err) {
                console.log(err);
                return res.send("Error al cargar el stock de ropa");
              });
        } else {
            return res.redirect('/');
        }
    },
    storeDonacion: function (req, res) {
        let errors = validationResult(req);
      
        if (!errors.isEmpty()) {
          return res.render('agregarDonacion', {
            errors: errors.mapped(),
            old: req.body
          });
        }
        //return res.send(req.body)
        // Crear la donación
        db.Donaciones.create({
          beneficiario: req.body.beneficiario,
          observaciones: req.body.observaciones,
          fecha: new Date(),
          categoria: req.body.categoria
        })
        .then(donacion => {
          // Normalizar arrays
          const ids = Array.isArray(req.body.articulo_id) ? req.body.articulo_id : [req.body.articulo_id];
          const cantidades = Array.isArray(req.body.cantidad) ? req.body.cantidad : [req.body.cantidad];
      
          // Buscar los talles o artículos
          if (req.body.categoria === 'Ropa') {
            return db.TallesRopa.findAll({
              where: { id: ids },
              include: [{ model: db.StockRopa, as: 'ropa' }]
            })
            .then(talles => {
              const items = talles.map((talleItem, index) => {
                return {
                  articulo: talleItem.ropa.articulo,
                  cantidad: cantidades[index],
                  talle: talleItem.talle,
                  categoria: talleItem.ropa.categoria,
                  donacion_id: donacion.id
                };
              });
      
              return db.DonacionItem.bulkCreate(items)
              .then(() => {
                // Actualizar stock de ropa
                const updates = talles.map((talleItem, index) => {
                  const nuevaCantidad = talleItem.cantidad - cantidades[index];
                  return talleItem.update({ cantidad: nuevaCantidad });
                });
                return Promise.all(updates);
              });
            });
          } else if (req.body.categoria === 'Alimentos') {
            return db.StockComida.findAll({
              where: { id: ids }
            })
            .then(articulos => {
              const items = articulos.map((articuloItem, index) => {
                return {
                  articulo: articuloItem.articulo,
                  cantidad: cantidades[index],
                  talle: null,
                  categoria: 'Alimentos',
                  donacion_id: donacion.id
                };
              });
      
              return db.DonacionItem.bulkCreate(items)
              .then(() => {
                const updates = articulos.map((item, index) => {
                  const nuevaCantidad = item.cantidad - cantidades[index];
                  return item.update({ cantidad: nuevaCantidad });
                });
                return Promise.all(updates);
              });
            });
          }
        })
        .then(() => {
          return res.redirect('/donaciones/realizadas');
        })
        .catch(error => {
          console.log("Error al guardar la donación o actualizar el stock:", error);
          return res.send("Error al guardar la donación");
        });
    },
    eliminarDonacion: function (req, res) {
        let id = req.params.id;

        // Eliminar primero los DonacionItems relacionados
        db.DonacionItem.destroy({ where: { donacion_id: id } })
            .then(() => {
                // Luego eliminar la donación
                return db.Donaciones.destroy({ where: { id } });
            })
            .then(() => {
                if (!res.headersSent) {
                    return res.redirect('/donaciones/realizadas');
                }
            })
            .catch(error => {
                console.error("❌ Error al eliminar la donación:", error);
                if (!res.headersSent) {
                    return res.send("Error al eliminar la donación");
                }
            });
    },
    editarDonacion: function (req, res) {
        if (req.session.user !== undefined) {
            const id = req.params.id;

            db.Donaciones.findByPk(id, {
                include: [{ model: db.DonacionItem, as: 'items' }]
              })
                .then(donacion => {
                    if (!donacion) return res.redirect('/donaciones/realizadas');
                    db.StockRopa.findAll({
                        include: [{ model: db.TallesRopa, as: 'talles' }]
                      })
                      .then(stockRopa => {
                        db.StockComida.findAll()
                        .then(stockComida => {
                          return res.render('editarDonacion', {
                            donacion: donacion,
                            items: donacion.items,
                            stockRopa: stockRopa,
                            stockComida: stockComida
                          });
                        });
                      });
                })
                .catch(err => {
                    console.log(err);
                    res.send("Error al cargar la donacion");
                });
        } else {
            return res.redirect('/');
        }
    },
    updateDonacion: function (req, res) {
        const id = req.params.id;
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('editarDonacion', {
                errors: errors.mapped(),
                old: req.body,
                donacion: { id }
            });
        }
        
        // Normalizar arrays
        const articulos = Array.isArray(req.body.articulo) ? req.body.articulo : [req.body.articulo];
        const cantidades = Array.isArray(req.body.cantidad) ? req.body.cantidad : [req.body.cantidad];
        const talles = req.body.talle ? (Array.isArray(req.body.talle) ? req.body.talle : [req.body.talle]) : [];
        
        // Paso 1: restaurar stock anterior
        db.DonacionItem.findAll({ where: { donacion_id: id } })
            .then((itemsAnteriores) => {
                const tareas = itemsAnteriores.map((item) => {
                    if (item.categoria === 'Ropa') {
                        return db.StockRopa.findOne({
                            where: { articulo: item.articulo },
                            include: [{
                                model: db.TallesRopa,
                                as: 'talles',
                                where: { talle: item.talle }
                            }]
                        }).then(stock => {
                            if (!stock || stock.talles.length === 0) return;
                            const talleItem = stock.talles[0];
                            return talleItem.update({ cantidad: talleItem.cantidad + item.cantidad });
                        });
                    } else if (item.categoria === 'Alimentos') {
                        return db.StockComida.findOne({
                            where: { articulo: item.articulo }
                        }).then(art => {
                            if (!art) return;
                            return art.update({ cantidad: art.cantidad + item.cantidad });
                        });
                    }
                });
                return Promise.all(tareas);
            })
            .then(() => {
                // Paso 2: actualizar datos de la donación
                return db.Donaciones.update({
                    beneficiario: req.body.nombre_beneficiario,
                    observaciones: req.body.observaciones,
                    categoria: req.body.categoria
                }, { where: { id } });
            })
            .then(() => {
                // Paso 3: eliminar ítems anteriores
                return db.DonacionItem.destroy({ where: { donacion_id: id } });
            })
            .then(() => {
                // Paso 4: crear nuevos ítems y actualizar stock
                if (req.body.categoria === 'Ropa') {
                    const tareas = articulos.map((nombreArticulo, i) => {
                        const talle = talles[i] || null;
                        const whereTalle = talle ? { talle } : {};

                        const cantidad = parseInt(cantidades[i]);
        
                        return db.StockRopa.findOne({
                            where: { articulo: nombreArticulo },
                            include: [{
                                model: db.TallesRopa,
                                as: 'talles',
                                where: whereTalle
                            }]
                        }).then(stock => {
                            if (!stock || stock.talles.length === 0) return;
                            const talleItem = stock.talles[0];
                            const nuevoItem = {
                                articulo: nombreArticulo,
                                cantidad: cantidad,
                                talle: talle,
                                categoria: stock.categoria,
                                donacion_id: id
                            };
                            return db.DonacionItem.create(nuevoItem).then(() => {
                                return talleItem.update({ cantidad: talleItem.cantidad - cantidad });
                            });
                        });
                    });
        
                    return Promise.all(tareas);
                } else if (req.body.categoria === 'Alimentos') {
                    const tareas = articulos.map((nombreArticulo, i) => {
                        const cantidad = parseInt(cantidades[i]);
        
                        return db.StockComida.findOne({ where: { articulo: nombreArticulo } })
                            .then(stock => {
                                if (!stock) return;
                                const nuevoItem = {
                                    articulo: nombreArticulo,
                                    cantidad: cantidad,
                                    talle: null,
                                    categoria: 'Alimentos',
                                    donacion_id: id
                                };
                                return db.DonacionItem.create(nuevoItem).then(() => {
                                    return stock.update({ cantidad: stock.cantidad - cantidad });
                                });
                            });
                    });
        
                    return Promise.all(tareas);
                }
            })
            .then(() => {
                return res.redirect('/donaciones/realizadas');
            })
            .catch(error => {
                console.error("❌ Error al editar la donación:", error);
                return res.send("Error al editar la donación");
            });
    }
}

module.exports = donacionesController;
