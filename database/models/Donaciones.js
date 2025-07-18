'use strict';
module.exports = (sequelize, DataTypes) => {
  let alias = "Donaciones";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    beneficiario: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    categoria: DataTypes.STRING,
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  };
  let config = {
    tableName: "Donaciones",
    timestamps: true
  };

  const Donaciones = sequelize.define(alias, cols, config);

  Donaciones.associate = function (models) {
    Donaciones.hasMany(models.DonacionItem, {
      foreignKey: 'donacion_id',
      as: 'items'
    });
  };

  return Donaciones;
};