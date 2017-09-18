'use strict'
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Tag',
      {
        Name: { type: DataTypes.STRING, primaryKey: true, field: 'name' },
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
        tableName: 'tags',
        underscored: true
      }
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('tags')
  }
}
