import * as Sequelize from 'sequelize'
import sequelize from '../db'

const Resource = sequelize.define(
  'Resource',
  {
    id: { type: Sequelize.STRING, primaryKey: true, field: 'id' },
    namespace: { type: Sequelize.STRING, field: 'namespace' }
  },
  {
    tableName: 'resources',
    underscored: true
  }
)

Resource.sync({
  force: process.env.NODE_ENV === 'production' ? false : true
})

export default Resource
