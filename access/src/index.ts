import * as grpc from 'grpc'
import * as path from 'path'
import db from '../../cohesiv/db'
import log from './log'
import config from './config'
import service from './service'

db
  .sync()
  .then(() => log.info('Successfully synced db'))
  .catch(e => log.error('Failed to sync database', e))

const cohesiv = grpc.load(path.resolve(process.cwd(), config.PROTO_PATH)).cohesiv
const server = new grpc.Server()
server.addService(cohesiv.Access.service, new service())
server.bind(`0.0.0.0:${config.PORT}`, grpc.ServerCredentials.createInsecure())
server.start()

export default server
