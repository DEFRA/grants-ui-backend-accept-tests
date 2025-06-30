import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

describe('Observability', () => {
  it('should return success application health', async () => {
    const res = await request(global.baseUrl)
      .get('/health')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(200)
    expect(res.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(res.headers['cache-control']).toEqual('no-cache')
    expect(res.body).toEqual({ message: 'success' })
  })

  if (process.env.ENVIRONMENT) { // test only works when hosted in CDP
    it('should return the same trace id in response as given in request', async () => {
      const uuid = uuidv4().replace(/-/g, '').toLowerCase()

    const res = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: `${uuidv4().replace(/-/g, '').toLowerCase()}`,
        userId: `123`,
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: {}
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-cdp-request-id', uuid)

      expect(res.status).toEqual(201)
      expect(res.header['x-cdp-request-id']).toBe(uuid)
    })
  }
})
