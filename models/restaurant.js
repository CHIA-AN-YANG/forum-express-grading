'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {

    static associate(models) {
      Restaurant.belongsTo(models.Category, {foreignKey: { name: 'CategoryId' }})
      Restaurant.hasMany(models.Comment)
    }
  };
  Restaurant.init({
    name: DataTypes.STRING(20),
    tel: DataTypes.STRING(20),
    address: DataTypes.STRING(127),
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT('tiny'),
    image: DataTypes.STRING(200)
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};