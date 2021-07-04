'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'description', {
      type: Sequelize.STRING(255)
    })
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING(127)
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'description')
    await queryInterface.removeColumn('Users', 'image')
  }
};
