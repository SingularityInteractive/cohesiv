import * as path from 'path'
import {} from 'jest'
import { clientFactory } from 'rxjs-grpc'

import config from '../src/config'
import { cohesiv as pb } from '../../cohesiv/cohesiv'

// Pass the path of proto file and the name of namespace
const Services = clientFactory<pb.ClientFactory>(
  path.resolve(process.cwd(), config.PROTO_PATH),
  'cohesiv'
)
// Create a client connecting to the server
const services = new Services(`localhost:${config.PORT}`)
// Get a client for the Greeter service
const access = services.getAccess()

describe('Access Service', () => {
  describe('Evaluate', () => {
    it('should evaluate a valid action with user id and namespace', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', true)
        done()
      }
      access
        .evaluate({
          namespace: 'gloo',
          user_id: 'user1',
          action: {
            action: 'tagdirectory:CreateTags',
            resource: 'io:cohesiv:tagdirectory:gloo/dog'
          }
        })
        .subscribe(callback)
    })

    it('should return invalid when an action for a resource is denied for a user, but allowed in a namespace', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', false)
        done()
      }
      access
        .evaluate({
          namespace: 'gloo',
          user_id: 'user1',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/cat'
          }
        })
        .subscribe(callback)
    })

    it('should return valid when an only a namespace is specified for an allowed namespace action', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', true)
        done()
      }
      access
        .evaluate({
          namespace: 'gloo',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/cat'
          }
        })
        .subscribe(callback)
    })

    it('should return valid when not explicitly denied an action in the default namespace', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', true)
        done()
      }
      access
        .evaluate({
          user_id: 'user1',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:default/dog'
          }
        })
        .subscribe(callback)
    })

    it('should return valid when a gloo user tries to get mypds tags', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', true)
        done()
      }
      access
        .evaluate({
          user_id: 'user1',
          namespace: 'gloo',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:mypds/dog'
          }
        })
        .subscribe(callback)
    })

    it('should return invalid when a mypds user tries to get gloo tags', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', false)
        done()
      }
      access
        .evaluate({
          user_id: 'user2',
          namespace: 'mypds',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/dog'
          }
        })
        .subscribe(callback)
    })
  })

  describe('EvaluateMany', () => {
    it('should evaluate an array of valid actions', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', true)
        done()
      }
      access
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
        .subscribe(callback)
    })

    it('should return invalid when one action is denied', done => {
      function callback(response: pb.AccessResponse) {
        expect(response).toHaveProperty('valid', false)
        done()
      }
      access
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
        .subscribe(callback)
    })
  })
})
