import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

describe('GET /state', () => {
  it('should retrieve a resource', async () => {
    const businessId = uuidv4()
    const userId = uuidv4()
    const stateValue = {
      property1: "value1",
      property2: "value2"
    }

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: 'adding-value',
        grantVersion: '1',
        state: stateValue
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=${userId}&grantId=adding-value`)
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(200)
    expect(retrieveResponse.body).toEqual(stateValue)
  })

  it('should retrieve an updated resource', async () => {
    const businessId = uuidv4()
    const userId = uuidv4()
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
        userId: userId,
        grantId: 'adding-value',
        grantVersion: '1',
        state: stateValue1
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse1 = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=${userId}&grantId=adding-value`)
      .set('Accept', 'application/json')

    expect(retrieveResponse1.status).toEqual(200)
    expect(retrieveResponse1.body).toEqual(stateValue1)

    const updateResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: 'adding-value',
        grantVersion: '1',
        state: stateValue2
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(updateResponse.status).toEqual(200)

    const retrieveResponse2 = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=${userId}&grantId=adding-value`)
      .set('Accept', 'application/json')

    expect(retrieveResponse2.status).toEqual(200)
    expect(retrieveResponse2.body).toEqual(stateValue2)
  })

  it('should return 404 when resource not found', async () => {
    const response = await request(global.baseUrl)
      .get(`/state?businessId=${uuidv4()}&userId=${uuidv4()}&grantId=adding-value`)
      .set('Accept', 'application/json')

    expect(response.status).toEqual(404)
  })

  it('should return 400 when required parameters not supplied', async () => {
    const businessId = uuidv4()
    const userId = uuidv4()

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: 'adding-value',
        grantVersion: '1',
        state: {}
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=${userId}`) // the API will 404 first so we must use valid stored values
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(400)
  })

  it('should ignore grantVersion when querying and return the highest version document', async () => {
    const businessId = uuidv4()
    const userId = uuidv4()
    const grantId = 'adding-value'

    const createResponseR1 = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: grantId,
        grantVersion: '1',
        state: {
          grantVersion: 'R1'
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponseR1.status).toEqual(201)

    const createResponseR2 = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: grantId,
        grantVersion: '2',
        state: {
          grantVersion: 'R2'
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponseR2.status).toEqual(201)

    const createResponseR3 = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: grantId,
        grantVersion: '3',
        state: {
          grantVersion: 'R3'
        }
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponseR3.status).toEqual(201)

    const retrieveResponse = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=${userId}&grantId=${grantId}&grantVersion=1`) // grantVersion param has no effect
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(200)
    expect(retrieveResponse.body).toEqual({
      grantVersion: 'R3'
    })
  })

  it('should receive expected response headers on GET', async () => {
    const businessId = uuidv4()
    const userId = uuidv4()

    const createResponse = await request(global.baseUrl)
      .post('/state')
      .send({
        businessId: businessId,
        userId: userId,
        grantId: 'adding-value',
        grantVersion: '1',
        state: {}
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    expect(createResponse.status).toEqual(201)

    const retrieveResponse = await request(global.baseUrl)
      .get(`/state?businessId=${businessId}&userId=${userId}&grantId=adding-value`)
      .set('Accept', 'application/json')

    expect(retrieveResponse.status).toEqual(200)
    expect(retrieveResponse.headers['content-type']).toEqual('application/json; charset=utf-8')
    expect(retrieveResponse.headers['cache-control']).toEqual('no-cache')
  })
})
