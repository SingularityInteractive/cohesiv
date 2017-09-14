import * as Sequelize from 'sequelize'
import sequelize from '../db'

const AccessStatement = sequelize.define(
  'AccessStatement',
  {
    Sid: { type: Sequelize.STRING, primaryKey: true, field: 'sid' },
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
    } // Defines an array. PostgreSQL only.
  },
  {
    tableName: 'access_statements',
    underscored: true
  }
)

AccessStatement.sync({
  force: process.env.NODE_ENV === 'production' ? false : true
})

export default AccessStatement
