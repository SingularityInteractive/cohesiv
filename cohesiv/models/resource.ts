import * as Sequelize from 'sequelize'
import sequelize from '../db'
import Tag from './tag'

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

Resource.belongsToMany(Tag, { as: 'Tags', through: 'tag_resources', foreignKey: 'resource_id' })

Resource.sync({
  force: process.env.NODE_ENV === 'production' ? false : true
})

export default Resource
