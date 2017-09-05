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
  PORT: Joi.number().default(8002),
  DB_CONNECTION_STRING: Joi.string()
    .required()
    .description('should be in format of mysql://root@localhost/db'),
  PROTO_PATH: Joi.string()
    .required()
    .description('The absolute path to the proto file')
})
  .unknown()
  .required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  DB_CONNECTION_STRING: envVars.DB_CONNECTION_STRING,
  PROTO_PATH: envVars.PROTO_PATH
}
