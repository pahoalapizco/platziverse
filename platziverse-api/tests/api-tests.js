'use strict'

const test = require('ava')
const request = require('supertest')
// const server = require('../server')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const {
  agentFixture,
  metricFixture
} = require('platziverse-utils')

let sandbox = null
let server = null
let dbStub = null
const AgentStub = {}
const MetricStub = {}

// variables para pruebas
const uuid = 'yyy-yyy-yyy-yyy'
const wUUID = 'yyyy'
const type = 'Memory'

test.beforeEach(() => {
  sandbox = sinon.createSandbox()
  dbStub = sandbox.stub()
  // el dbStub va a regresar una promesa que al resolverse entregará
  // los stubs de Agent y Metric
  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixture.connected))
  
  AgentStub.findByUuId = sandbox.stub()
  AgentStub.findByUuId.withArgs(uuid).returns(Promise.resolve(agentFixture.byUUid(uuid)))
  AgentStub.findByUuId.withArgs(wUUID).returns(Promise.resolve(null))

  // Metrics
  MetricStub.findByAgentUuid = sandbox.stub()
  MetricStub.findByAgentUuid.withArgs(uuid).returns(Promise.resolve(metricFixture.byAgentUuid(uuid)))
  MetricStub.findByAgentUuid.withArgs(wUUID).returns(Promise.resolve(null))

  MetricStub.findByTypeAgentUuid = sandbox.stub()
  MetricStub.findByTypeAgentUuid.withArgs(type, uuid).returns(Promise.resolve(metricFixture.byTypeAgentUuid(type, uuid)))
  MetricStub.findByTypeAgentUuid.withArgs(type, wUUID).returns(Promise.resolve(null))

  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))

  // Cuando en el archivo api.js se haga el 'requiere' al modulo platziverse-db
  // se va a regresar el stub que se creo arriba.
  const api = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  // Cuando en el archivo server,js se haga el require a 'api' vamos a deolver
  // la variable api que creamos arriba.
  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(() => {
  sandbox && sinon.resetHistory()
})

// serial: corre lista de test encapsuladas en un segmento
// cb: ejecuta un callback al final, esto debido a la utilización de supertest.
test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'No deberia regresar un error.')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(agentFixture.connected)
      t.deepEqual(body, expected, 'El body de a respuesta debe ser igual al esperado (obj vacio)')
      t.end() // esta función solo se utiliza cuando usamos la funcion .cb()
    })
})

// @TODO
test.serial.cb('/api/agents/:uuid', t => {
  request(server)
    .get('/api/agents/yyy-yyy-yyy-yyy')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, `No deberia regresar un error al obtener el agent ${uuid}`)
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(agentFixture.byUUid(uuid))
      t.deepEqual(body, expected, `La respuesta debe ser igual al agente ${uuid}`)
      t.end()
    })
})

test.serial.cb('/api/agents/:uuid - not fount', t => {
  request(server)
    .get(`/api/agents/${wUUID}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.truthy(res.body.error, 'Debe regresar un error 404')
      t.regex(res.body.error, /not found/, 'Debería regresar un mensaje de no encontrado')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid', t => {
  request(server)
    .get(`/api/metrics/${uuid}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'No deberia regresar un error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(metricFixture.byAgentUuid(uuid))
      t.deepEqual(body, expected, `Las respuesta debería ser igual al valor esperado`)
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid - not fount', t => {
  request(server)
    .get(`/api/metrics/${wUUID}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.truthy(res.body.error, 'Debe regresar un error 404')
      t.regex(res.body.error, /not found/, 'Debería regresar un mensaje de no encontrado')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type', t => {
    request(server)
      .get(`/api/metrics/${uuid}/${type}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        t.falsy(err, 'No debería regresar un error')
        const body = JSON.stringify(res.body)
        const expected = JSON.stringify(metricFixture.byTypeAgentUuid(type, uuid))
        t.deepEqual(body, expected, 'La respuesta debería ser igual al valor esperado')
        t.end()
      })
})

test.serial.cb('/api/metrics/:uuid/:type - not fount', t => {
  request(server)
  .get(`/api/metrics/${wUUID}/${type}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.truthy(res.body.error, 'Debe regresar un error 404')
      t.regex(res.body.error, /not found/, 'Debería regresar un mensaje de no encontrado')
      t.end()
    })
})
