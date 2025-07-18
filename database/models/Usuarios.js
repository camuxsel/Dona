'use strict';
module.exports = function (sequelize, DataTypes) {
  let alias = "Usuarios";
  let cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombreUsuario: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    contrasena: DataTypes.STRING,
    rol: {
      type: DataTypes.STRING
    },
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
    tableName: "Usuarios",
    timestamps: true
  };

  const Usuarios = sequelize.define(alias, cols, config);
  Usuarios.associate = function (models) {
    // Relaciones futuras
  };
  return Usuarios;
};