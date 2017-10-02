import chai, { expect } from 'chai'
import request from 'supertest-as-promised'
import httpStatus from 'http-status'
import app from '../index'

describe('## Misc', () => {
  describe('# GET /healthcheck', () => {
    it('should return OK', done => {
      request(app)
        .get('/healthcheck')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('uptime')
          done()
        })
        .catch(done)
    })
  })

  describe('# GET v1/api/404', () => {
    it('should return 404 status', done => {
      request(app)
        .get('/v1/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Not Found')
          done()
        })
        .catch(done)
    })
  })
})
