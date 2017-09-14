import * as winston from 'winston'
import config from './config'

const log = new winston.Logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
})

if (config.ENV === 'development') log.level = 'debug'

export default log
