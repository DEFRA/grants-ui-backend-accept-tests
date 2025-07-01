import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

describe('/state', () => {
  it('should create a new resource', async () => {
    const response = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: uuidv4(),
        userId: uuidv4(),
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: {}
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(201)
    expect(response.body.success).toEqual(true)
    expect(response.body.created).toEqual(true)
  })

  it('should update an existing resource', async () => {
    const businessId = uuidv4()
    const userId = uuidv4()

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: {
          property: "original"
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const updateResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: {
          property: "updated"
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(updateResponse.status).toEqual(200)
    expect(updateResponse.body.success).toEqual(true)
    expect(updateResponse.body.updated).toEqual(true)
  })

  it('should receive expected response headers on POST', async () => {
    const response = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: uuidv4(),
        userId: uuidv4(),
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: {}
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(201)
    expect(response.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(response.headers['cache-control']).toEqual('no-cache')
  })

  it('should return 400 when input does not conform to expected JSON format', async () => {
    const response = await request(global.baseUrl)
      .post('/state')
      .send({
        invalid: 'invalid'
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(400)
  })
})
