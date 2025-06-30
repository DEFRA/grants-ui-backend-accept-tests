import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

describe('/state', () => {
  it('should create a new resource', async () => {
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

    expect(res.status).toEqual(201)
    expect(res.body.success).toEqual(true)
    expect(res.body.created).toEqual(true)
  })

  it('should receive expected headers', async () => {
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

    expect(res.status).toEqual(201)
    expect(res.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(res.headers['cache-control']).toEqual('no-cache')
  })

  it('should return 400 when input does not conform to expected JSON format', async () => {
    const res = await request(global.baseUrl)
      .post('/state')
      .send({
        invalid: 'invalid'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(res.status).toEqual(400)
  })
})
