import * as Sequelize from 'sequelize'
import sequelize from '../db'
import Resource from './resource'

const Tag = sequelize.define(
  'Tag',
  {
    name: { type: Sequelize.STRING, primaryKey: true, field: 'name' }
  },
  {
    tableName: 'tags',
    underscored: true
  }
)

Tag.belongsToMany(Resource, { as: 'Resources', through: 'tag_resources', foreignKey: 'tag_name' })

Tag.sync({
  force: process.env.NODE_ENV === 'production' ? false : true
})

export default Tag
