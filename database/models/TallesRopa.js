'use strict';
module.exports = function (sequelize, DataTypes) {
  let alias = "TallesRopa";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ropa_id: {
        type: DataTypes.INTEGER
    },
    talle: {
        type: DataTypes.STRING
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    updatedAt: {
        type: DataTypes.DATE
    },
    deletedAt: {
        type: DataTypes.DATE
    }
  };
  let config = {
    tableName: "TallesRopa",
    timestamps: true
  };
  const TallesRopa = sequelize.define(alias, cols, config);
  TallesRopa.associate = function (models) {
    TallesRopa.belongsTo(models.StockRopa, {
        foreignKey: 'ropa_id',
        as: 'ropa'
      });
    } 
  return TallesRopa;
};