import { Observable } from 'rxjs'
import { serverBuilder } from 'rxjs-grpc'
import * as path from 'path'
import { cohesiv } from '../../cohesiv/cohesiv'
import db from '../../cohesiv/db'
import log from './log'
import config from './config'
import service from './service'

const protoPath = path.resolve(process.cwd(), config.PROTO_PATH)

db
  .sync()
  .then(() => log.info('Successfully synced db'))
  .catch(e => log.error('Failed to sync database', e))

async function main() {
  type ServerBuilder = cohesiv.ServerBuilder
  const server = serverBuilder<ServerBuilder>(protoPath, 'cohesiv')

  server.addAccess(new service())

  server.start(`0.0.0.0:${config.PORT}`)
}

main().catch(error => console.error(error))
