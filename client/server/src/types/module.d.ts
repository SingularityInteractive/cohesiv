declare module 'express-validation'
declare module 'body-parser'
declare module 'cookie-parser'
declare module 'compression'
declare module 'method-override'
declare module 'cors'
declare module 'express-https-redirect'
declare module 'express-winston'
declare module 'express-validation'
declare module 'helmet'
declare module 'express-healthcheck'

interface ValidationErrors {
  status: number
  statusText: string
  errors: ValidationError[]
}
interface ValidationError {
  field: string
  location: string
  messages: string[]
  types: string[]
}
