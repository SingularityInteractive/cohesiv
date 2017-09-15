import * as Sequelize from 'sequelize'

const sequelize = new Sequelize(process.env['DB_CONNECTION_STRING'])

export default sequelize
