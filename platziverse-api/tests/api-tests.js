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

test.beforeEach(() => {
  sandbox = sinon.sandbox.create()
  dbStub = sandbox.stub()
  // el dbStub va a regresar una promesa que al resolverse entregará
  // los stubs de Agent y Metric
  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixture.connected))

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
test.serial.todo('/api/agents/:uuid')
test.serial.todo('/api/agents/:uuid - not fount')

test.serial.todo('/api/metrics/:uuid')
test.serial.todo('/api/metrics/:uuid - not fount')

test.serial.todo('/api/metrics/:uuid/:type')
test.serial.todo('/api/metrics/:uuid/:type - not fount')
