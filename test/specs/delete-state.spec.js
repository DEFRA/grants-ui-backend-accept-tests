import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { getGrantsUiBackendAuthorizationToken } from '../services/backend-auth-helper'

describe('DELETE /state', () => {
  var AUTHORIZATION_TOKEN

  beforeAll(() => {
    AUTHORIZATION_TOKEN = getGrantsUiBackendAuthorizationToken()
  })

  it('should delete a resource', async () => {
    const sbi = uuidv4()
    const grantCode='test-grant'
    const stateValue = {
      property1: "value1"
    }

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        sbi: sbi,
        grantCode: grantCode,
        grantVersion: '1',
        state: stateValue
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)
    expect(createResponse.status).toEqual(201)

    const retrieveResponse1 = await request(global.baseUrl)
      .get(`/state?sbi=${sbi}&grantCode=${grantCode}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)
    expect(retrieveResponse1.status).toEqual(200)

    const deleteResponse = await request(global.baseUrl)
      .delete(`/state?sbi=${sbi}&grantCode=${grantCode}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)
    expect(deleteResponse.status).toEqual(200)

    const retrieveResponse2 = await request(global.baseUrl)
      .get(`/state?sbi=${sbi}&grantCode=${grantCode}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)
    expect(retrieveResponse2.status).toEqual(404)
  })

  it('should return 404 when resource not found', async () => {
    const response = await request(global.baseUrl)
      .delete(`/state?sbi=${uuidv4()}&grantCode=test-grant`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(response.status).toEqual(404)
  })

  it('should return 401 when authorization header not supplied', async () => {
    const retrieveResponse = await request(global.baseUrl)
      .delete(`/state?sbi=${uuidv4()}&grantCode=test-grant`)
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(401)
  })

  it('should return 400 when required parameters not supplied', async () => {
    const retrieveResponse = await request(global.baseUrl)
      .delete(`/state?sbi=${uuidv4()}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(retrieveResponse.status).toEqual(400)
  })

  it('should ignore grantVersion when querying and delete the highest version document', async () => {
    const sbi = uuidv4()
    const grantCode = 'test-grant'

    const createResponseR1 = await request(global.baseUrl)
      .post('/state')
      .send({
        sbi: sbi,
        grantCode: grantCode,
        grantVersion: '1',
        state: {
          grantVersion: 'R1'
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(createResponseR1.status).toEqual(201)

    const createResponseR2 = await request(global.baseUrl)
      .post('/state')
      .send({
        sbi: sbi,
        grantCode: grantCode,
        grantVersion: '2',
        state: {
          grantVersion: 'R2'
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(createResponseR2.status).toEqual(201)

    const createResponseR3 = await request(global.baseUrl)
      .post('/state')
      .send({
        sbi: sbi,
        grantCode: grantCode,
        grantVersion: '3',
        state: {
          grantVersion: 'R3'
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(createResponseR3.status).toEqual(201)

    const retrieveResponse1 = await request(global.baseUrl)
      .get(`/state?sbi=${sbi}&grantCode=${grantCode}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(retrieveResponse1.status).toEqual(200)
    expect(retrieveResponse1.body).toEqual({
      grantVersion: 'R3'
    })

    const deleteResponse = await request(global.baseUrl)
      .delete(`/state?sbi=${sbi}&grantCode=${grantCode}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(deleteResponse.status).toEqual(200)

    const retrieveResponse3 = await request(global.baseUrl)
      .get(`/state?sbi=${sbi}&grantCode=${grantCode}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)

    expect(retrieveResponse3.status).toEqual(200)
    expect(retrieveResponse3.body).toEqual({
      grantVersion: 'R2'
    })
  })
})
