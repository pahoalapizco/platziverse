'use strict'

const test = require('ava')
const proxyquire = require('proxyquire') // sobre escribe los require's que la función esta haciendo.
const sinon = require('sinon')
const agentFixture = require('./fixtures/agent')

// stubs
const metricStub = {
  belongsTo: sinon.spy()
}

const config = {
  loggin: function () {}
}

let db = null
let agentStub = null
let sandbox = null
const single = Object.assign({}, agentFixture.single)
const id = 1

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  agentStub = {
    hasMany: sandbox.spy()
  }
  // Sobreescribir los modelos con los Stubs Agent & Metric
  const setupDataBase = proxyquire('../', {
    './models/metric': () => metricStub, // Metric Sub reemplazara al metricModel
    './models/agent': () => agentStub // Agent Sub reemplazara al agentModel
  })
  db = await setupDataBase(config)
})

test.afterEach(async () => {
  sandbox && sinon.resetHistory()
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exists!')
})

test.serial('Setup', async t => {
  t.true(agentStub.hasMany.called, 'AgentModel.hasMany was executed!')
  t.true(agentStub.hasMany.calledWith(metricStub), 'Argument should be the model')
  t.true(metricStub.belongsTo.called, 'MetricModel.hasMany was executed!')
  t.true(metricStub.belongsTo.calledWith(agentStub), 'Argument shoul be the model (Agent)')
})

test.serial('Agent#findById', async t => {
  const agent = await db.Agent.findById(id)

  t.deepEqual(agent, agentFixture.byId(id), 'Shoul be the same')
})
