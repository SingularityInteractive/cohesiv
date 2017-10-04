import chai, { expect } from 'chai'
import * as request from 'supertest-as-promised'
import * as httpStatus from 'http-status'
import * as jwt from 'jsonwebtoken'
import app from '../index'
import config from '../config/index'

describe('## Auth APIs', () => {
  const validUserCredentials = {
    username: 'react',
    password: 'express'
  }

  const invalidUserCredentials = {
    username: 'react',
    password: 'IDontKnow'
  }

  let jwtToken

  describe('# POST v1/api/auth/login', () => {
    it('should return Authentication error', done => {
      request(app)
        .post('/v1/api/auth/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal('Authentication error')
          done()
        })
        .catch(done)
    })

    it('should get valid JWT token', done => {
      request(app)
        .post('/v1/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('token')
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.equal(null)
            expect(decoded.username).to.equal(validUserCredentials.username)
            jwtToken = `Bearer ${res.body.token}`
            done()
          })
        })
        .catch(done)
    })
  })

  describe('# GET v1/api/auth/random-number', () => {
    it('should fail to get random number because of missing Authorization', done => {
      request(app)
        .get('/v1/api/auth/random-number')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal('Unauthorized')
          done()
        })
        .catch(done)
    })

    it('should fail to get random number because of wrong token', done => {
      request(app)
        .get('/v1/api/auth/random-number')
        .set('Authorization', 'Bearer inValidToken')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal('Unauthorized')
          done()
        })
        .catch(done)
    })

    it('should get a random number', done => {
      request(app)
        .get('/v1/api/auth/random-number')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then(res => {
          expect(typeof res.body.num).to.equal('number')
          done()
        })
        .catch(done)
    })
  })
})