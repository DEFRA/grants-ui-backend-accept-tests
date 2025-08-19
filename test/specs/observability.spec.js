import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { getGrantsUiBackendAuthorizationToken } from '../services/backend-auth-helper'

describe('Observability', () => {
  var AUTHORIZATION_TOKEN

  beforeAll(() => {
    AUTHORIZATION_TOKEN = getGrantsUiBackendAuthorizationToken()
  })

  it('should return success application health', async () => {
    const response = await request(global.baseUrl)
      .get('/health')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(200)
    expect(response.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(response.headers['cache-control']).toEqual('no-cache')
    expect(response.body).toEqual({ message: 'success' })
  })

  if (process.env.ENVIRONMENT) { // test only works when hosted in CDP
    it('should return the same trace id in response as given in request', async () => {
      const cdpRequestId = uuidv4().replace(/-/g, '').toLowerCase()

      const response = await request(global.baseUrl)
        .post('/state')
        .send({
          businessId: uuidv4(),
          userId: uuidv4(),
          grantId: 'adding-value',
          grantVersion: '1',
          state: {}
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', `Basic ${AUTHORIZATION_TOKEN}`)
        .set('X-cdp-request-id', cdpRequestId)

      expect(response.status).toEqual(201)
      expect(response.header['x-cdp-request-id']).toBe(cdpRequestId)
    })
  }
})
