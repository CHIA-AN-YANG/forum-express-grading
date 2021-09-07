'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
    }
  };
  Favorite.init({
    UserId: DataTypes.INTEGER.UNSIGNED,
    RestaurantId: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};