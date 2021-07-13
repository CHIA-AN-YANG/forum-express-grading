'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {
    }
  };
  Followship.init({
    followerId: DataTypes.INTEGER.UNSIGNED,
    followingId: DataTypes.INTEGER.UNSIGNED
  }, {
    sequelize,
    modelName: 'Followship',
  });
  return Followship;
};