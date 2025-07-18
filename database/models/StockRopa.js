'use strict';
module.exports = function (sequelize, DataTypes) {
  let alias = "StockRopa";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    articulo: DataTypes.STRING,
    genero: DataTypes.STRING,
    categoria: DataTypes.STRING,
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
    tableName: "StockRopa",
    timestamps: true,
    paranoid: true
  };
  const StockRopa = sequelize.define(alias, cols, config);
  StockRopa.associate = function (models) {
    StockRopa.hasMany(models.TallesRopa, {
      foreignKey: 'ropa_id',
      as: 'talles'
    });
  };
  return StockRopa;
};