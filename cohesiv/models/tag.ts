import * as Sequelize from 'sequelize'
import sequelize from '../db'

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

Tag.sync({
  force: process.env.NODE_ENV === 'production' ? false : true
})

export default Tag
