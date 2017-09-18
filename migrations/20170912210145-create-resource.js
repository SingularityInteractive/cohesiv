'use strict'
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Resource',
      {
        id: { type: DataTypes.STRING, primaryKey: true, field: 'id' },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        tableName: 'resources',
        underscored: true
      }
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('resources')
  }
}
