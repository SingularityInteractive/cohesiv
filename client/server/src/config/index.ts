import * as Joi from 'joi'
import * as path from 'path'
import * as fs from 'fs'

if (fs.existsSync(path.resolve(process.cwd(), '.env')))
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number().default(4040),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  DB_CONNECTION_STRING: Joi.string()
    .required()
    .description('should be in format of mysql://root@localhost/db')
})
  .unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  dbConnectionString: envVars.DB_CONNECTION_STRING
}

export default config
