import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

describe('/state', () => {
  it('should create a new resource', async () => {
    const response = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: `${uuidv4().replace(/-/g, '').toLowerCase()}`,
        userId: '123',
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
    const businessId = uuidv4().replace(/-/g, '').toLowerCase()

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: '123',
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
        userId: `123`,
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

  it('should retrieve a resource', async () => {
    const businessId = uuidv4().replace(/-/g, '').toLowerCase()
    const stateValue = {
      property1: "value1",
      property2: "value2"
    }

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: '123',
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: stateValue
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=123&grantId=adding-value&grantVersion=R2`)
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(200)
    expect(retrieveResponse.body.state).toEqual(stateValue)
  })

  it('should retrieve an updated resource with the update', async () => {
    const businessId = uuidv4().replace(/-/g, '').toLowerCase()
    const stateValue1 = {
      property1: "value1"
    }
    const stateValue2 = {
      property2: "value2"
    }

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: '123',
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: stateValue1
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse1 = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=123&grantId=adding-value&grantVersion=R2`)
      .set('Accept', 'application/json')

    expect(retrieveResponse1.status).toEqual(200)
    expect(retrieveResponse1.body.state).toEqual(stateValue1)

    const updateResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: '123',
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: stateValue2
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(updateResponse.status).toEqual(200)

    const retrieveResponse2 = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=123&grantId=adding-value&grantVersion=R2`)
      .set('Accept', 'application/json')

    expect(retrieveResponse2.status).toEqual(200)
    expect(retrieveResponse2.body.state).toEqual(stateValue2)
  })

  it('should receive expected response headers on POST', async () => {
    const response = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: `${uuidv4().replace(/-/g, '').toLowerCase()}`,
        userId: '123',
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

  it('GET should receive expected response headers on GET', async () => {
    const businessId = uuidv4().replace(/-/g, '').toLowerCase()

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: '123',
        grantId: 'adding-value',
        grantVersion: 'R2',
        state: {}
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=123&grantId=adding-value&grantVersion=R2`)
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(200)
    expect(retrieveResponse.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(retrieveResponse.headers['cache-control']).toEqual('no-cache')
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
