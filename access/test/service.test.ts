import * as path from 'path'
import {} from 'jest'
import * as grpc from 'grpc'
import config from '../src/config'
import { cohesiv as pb } from '../../cohesiv/cohesiv'

const cohesiv = grpc.load(path.resolve(process.cwd(), config.PROTO_PATH)).cohesiv
const client = new cohesiv.Access(`localhost:${config.PORT}`, grpc.credentials.createInsecure())

describe('Access Service', () => {
  describe('Evaluate', () => {
    it('should evaluate a valid action with user id and namespace', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', true)
        done()
      }
      client.evaluate(
        {
          namespace: 'gloo',
          user_id: 'user1',
          action: {
            action: 'tagdirectory:CreateTags',
            resource: 'io:cohesiv:tagdirectory:gloo/dog'
          }
        },
        callback
      )
    })

    it('should return invalid when an action for a resource is denied for a user, but allowed in a namespace', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', false)
        done()
      }
      client.evaluate(
        {
          namespace: 'gloo',
          user_id: 'user1',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/cat'
          }
        },
        callback
      )
    })

    it('should return valid when an only a namespace is specified for an allowed namespace action', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', true)
        done()
      }
      client.evaluate(
        {
          namespace: 'gloo',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/cat'
          }
        },
        callback
      )
    })

    it('should return valid when not explicitly denied an action in the default namespace', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', true)
        done()
      }
      client.evaluate(
        {
          user_id: 'user1',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:default/dog'
          }
        },
        callback
      )
    })

    it('should return valid when a gloo user tries to get mypds tags', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', true)
        done()
      }
      client.evaluate(
        {
          user_id: 'user1',
          namespace: 'gloo',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:mypds/dog'
          }
        },
        callback
      )
    })

    it('should return invalid when a mypds user tries to get gloo tags', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', false)
        done()
      }
      client.evaluate(
        {
          user_id: 'user2',
          namespace: 'mypds',
          action: {
            action: 'tagdirectory:GetTags',
            resource: 'io:cohesiv:tagdirectory:gloo/dog'
          }
        },
        callback
      )
    })
  })

  describe('EvaluateMany', () => {
    it('should evaluate an array of valid actions', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', true)
        done()
      }
      client.evaluateMany(
        {
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
        },
        callback
      )
    })

    it('should return invalid when one action is denied', done => {
      function callback(err: Error, response: pb.AccessResponse) {
        expect(err).toBe(null)
        expect(response).toHaveProperty('valid', false)
        done()
      }
      client.evaluateMany(
        {
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
        },
        callback
      )
    })
  })
})
