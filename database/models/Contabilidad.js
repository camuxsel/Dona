'use strict';
module.exports = function (sequelize, DataTypes) {
  let alias = "Contabilidad";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fecha: DataTypes.DATE,
    tipo: {
      type: DataTypes.ENUM('donacion', 'gasto', 'ingreso')
    },
    descripcion: DataTypes.TEXT,
    monto: DataTypes.DECIMAL(10, 2)
  };
  let config = {
    tableName: "contabilidad",
    timestamps: true
  };
  const Contabilidad = sequelize.define(alias, cols, config);
  Contabilidad.associate = function (models) {
    // Relaciones futuras
  };
  return Contabilidad;
};
