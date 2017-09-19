import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as compress from 'compression'
import * as methodOverride from 'method-override'
import * as cors from 'cors'
import * as httpStatus from 'http-status'
import * as httpsRedirect from 'express-https-redirect'
import * as expressWinston from 'express-winston'
import * as expressValidation from 'express-validation'
import * as helmet from 'helmet'
import * as serveStatic from 'serve-static'
import * as healthCheck from 'express-healthcheck'
import log from './logger'
import routes from '../routes/index.route'
import config from './index'
import APIError from '../helpers/APIError'

const app = express()

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(
    expressWinston.logger({
      log,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  )
}

// Automatically redirect to https
if (config.env !== 'test') app.use('/', httpsRedirect())
// mount a health check
app.use('/healthcheck', healthCheck())
// mount all routes on /v1/api path
app.use('/v1/api', routes)
// serve files from the public directory
app.use(serveStatic(path.resolve(process.cwd(), './public')))

// if error is not an instanceOf APIError, convert it.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map((error: ValidationError) => error.messages.join('. '))
      .join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      log
    })
  )
}

// // error handler, send stacktrace only during development
app.use((err: APIError, req: express.Request, res: express.Response, next: express.NextFunction) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
)

export default app
