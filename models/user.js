'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Comment)
    }
  };
  User.init({
    name: DataTypes.STRING(20),
    email: DataTypes.STRING(127),
    password: DataTypes.STRING(200),
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING(127), 
    description: DataTypes.STRING(255), 
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    createdAt: 'registeredAt'
  });
  return User;
};