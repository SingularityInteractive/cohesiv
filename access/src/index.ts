import { Observable } from 'rxjs'
import { serverBuilder } from 'rxjs-grpc'
import * as path from 'path'
import { cohesiv } from '../../cohesiv/cohesiv'
import config from './config'
import service from './service'

// Pass the path of proto file and the name of namespace
const server = serverBuilder<cohesiv.ServerBuilder>(
  path.resolve(process.cwd(), config.PROTO_PATH),
  'cohesiv'
)
// Add implementation
server.addAccess(new service())
server.start(`0.0.0.0:${config.PORT}`)

export default server
