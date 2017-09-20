import { clientFactory } from 'rxjs-grpc'
import 'rxjs/add/operator/toPromise'
import * as path from 'path'
import {} from 'jest'
import config from '../src/config'
import { cohesiv as pb } from '../../cohesiv/cohesiv'

const protoPath = path.resolve(process.cwd(), config.PROTO_PATH)

type ClientFactory = pb.ClientFactory
const Services = clientFactory<ClientFactory>(protoPath, 'cohesiv')

const services = new Services(`localhost:${config.PORT}`)
const access = services.getAccess()

describe('Access Service', () => {
  describe('Evaluate', () => {
    it('should evaluate a valid action with user id and namespace', async () => {
      const response = await access
        .evaluate({
          namespace: 'gloo',
          user_id: 'user1',
          action: {
            action: 'tagdirectory:CreateTags',
            resource: 'io:cohesiv:tagdirectory:gloo/dog'
          }
        })
        .toPromise()
      expect(response).toHaveProperty('valid', true)
    })

    it('should return invalid when an action for a resource is denied for a user, but allowed in a namespace', async () => {
      const response = await access
        .evaluate({
          namespace: 'gloo',
          user_id: 'user1',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/cat'
          }
        })
        .toPromise()
      expect(response).toHaveProperty('valid', false)
    })

    it('should return valid when an only a namespace is specified for an allowed namespace action', async () => {
      const response = await access
        .evaluate({
          namespace: 'gloo',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/cat'
          }
        })
        .toPromise()
      expect(response).toHaveProperty('valid', true)
    })

    it('should return valid when not explicitly denied an action in the default namespace', async () => {
      const response = await access
        .evaluate({
          user_id: 'user1',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:default/dog'
          }
        })
        .toPromise()
      expect(response).toHaveProperty('valid', true)
    })

    it('should return valid when a gloo user tries to get mypds tags', async () => {
      const response = await access
        .evaluate({
          user_id: 'user1',
          namespace: 'gloo',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:mypds/dog'
          }
        })
        .toPromise()
      expect(response).toHaveProperty('valid', true)
    })

    it('should return invalid when a mypds user tries to get gloo tags', async () => {
      const response = await access
        .evaluate({
          user_id: 'user2',
          namespace: 'mypds',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/dog'
          }
        })
        .toPromise()
      expect(response).toHaveProperty('valid', false)
    })
  })

  describe('EvaluateMany', () => {
    it('should evaluate an array of valid actions', async () => {
      const response = await access
        .evaluateMany({
          namespace: 'gloo',
          user_id: 'user1',
          actions: [
            {
              action: 'tagdirectory:CreateTags',
              resource: 'io:cohesiv:tagdirectory:gloo/dog'
            },
            {
              action: 'tagdirectory:GetTags',
              resource: 'io:cohesiv:tagdirectory:default/dog'
            }
          ]
        })
        .toPromise()
      expect(response).toHaveProperty('valid', true)
    })

    it('should return invalid when one action is denied', async () => {
      const response = await access
        .evaluateMany({
          namespace: 'gloo',
          user_id: 'user1',
          actions: [
            {
              action: 'tagdirectory:CreateTags',
              resource: 'io:cohesiv:tagdirectory:gloo/dog'
            },
            {
              action: 'tagdirectory:GetTags',
              resource: 'io:cohesiv:tagdirectory:gloo/cat'
            }
          ]
        })
        .toPromise()
      expect(response).toHaveProperty('valid', false)
    })
  })
})
