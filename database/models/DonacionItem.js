'use strict';
module.exports = (sequelize, DataTypes) => {
  let alias = "DonacionItem";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    articulo_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    articulo: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    talle: DataTypes.STRING, // Opcional, si aplica
    categoria: DataTypes.STRING, // "Ropa" o "Alimentos"
    donacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  };
  let config = {
    tableName: "DonacionItems",
    timestamps: false
  };

  const DonacionItem = sequelize.define(alias, cols, config);

  DonacionItem.associate = function (models) {
    DonacionItem.belongsTo(models.Donaciones, {
      foreignKey: 'donacion_id',
      as: 'donaciones'
    });
  };

  return DonacionItem;
};