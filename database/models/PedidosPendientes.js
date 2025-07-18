'use strict';
module.exports = function (sequelize, DataTypes) {
  let alias = "PedidosPendientes";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    nombre_solicitante: DataTypes.STRING,
    siervo_encargado: DataTypes.STRING,
    categoria:DataTypes.STRING,
    necesidad: DataTypes.STRING,
    direccion: DataTypes.STRING,
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'Pendiente'
    }
  };
  let config = {
    tableName: "PedidosPendientes",
    timestamps: true
  };
  const PedidosPendientes = sequelize.define(alias, cols, config);
  PedidosPendientes.associate = function (models) {
    PedidosPendientes.hasMany(models.StockRopa, { foreignKey: 'ropa_id' });
    PedidosPendientes.hasMany(models.StockComida, { foreignKey: 'comida_id' });
  };
  return PedidosPendientes;
};
