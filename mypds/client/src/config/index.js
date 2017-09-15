import Joi from 'react-native-joi'
import development from './development'
import production from './production'

const config = process.env.NODE_ENV === 'development' ? development : production

// define validation for all the env vars
const envVarsSchema = Joi.object({
  API_URL: Joi.string().required()
  // NODE_ENV: Joi.string()
  //   .allow(['development', 'production', 'test', 'provision'])
  //   .default('development'),
  // PORT: Joi.number()
  //   .default(4040),
  // JWT_SECRET: Joi.string().required()
  //   .description('JWT Secret required to sign')
})
  .unknown()
  .required()

const { error, value: envVars } = Joi.validate(config, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default Object.assign({}, envVars, process.env)
