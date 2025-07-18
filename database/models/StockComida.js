'use strict';
module.exports = function (sequelize, DataTypes) {
  let alias = "StockComida";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    articulo: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    observaciones: DataTypes.STRING,
    fecha_vencimiento: DataTypes.DATE,
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    },
    deletedAt: {
        type: DataTypes.DATE
    }
  };
  let config = {
    tableName: "StockComida",
    timestamps: true,
    paranoid: true
  };
  const StockComida = sequelize.define(alias, cols, config);

  return StockComida;
};