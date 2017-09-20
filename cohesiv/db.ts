import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'

if (fs.existsSync(path.resolve(process.cwd(), '.env')))
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

const sequelize = new Sequelize(process.env['DB_CONNECTION_STRING'], {
  dialect: 'postgres'
})

export default sequelize
