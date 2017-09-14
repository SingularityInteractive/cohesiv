'use strict'
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'AccessStatement',
      {
        Sid: { type: DataTypes.STRING, primaryKey: true, field: 'sid' },
        Effect: {
          type: Sequelize.STRING,
          allowNull: false,
          field: 'effect'
        },
        Action: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: false,
          field: 'action'
        }, // Defines an array. PostgreSQL only.
        Resource: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: false,
          field: 'resource'
        }, // Defines an array. PostgreSQL only.
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
        tableName: 'access_statements',
        underscored: true
      }
    )
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('accessStatement')
  }
}
