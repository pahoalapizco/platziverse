'use strict'

const test = require('ava')
const proxyquire = require('proxyquire') // sobre escribe los require's que la función esta haciendo.
const sinon = require('sinon')
const agentFixture = require('./fixtures/agent')

// stubs
const MetricStub = {
  belongsTo: sinon.spy()
}

const config = {
  logging () {}
}

let db = null
let AgentStub = null
let sandbox = null
const single = Object.assign({}, agentFixture.single)
const id = 1
const uuid = 'yyy-yyy-yyy-yyy'
const uuidArgs = {
  where: { uuid }
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixture.byUUid(uuid)))
  
  // Model update Stub
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  // findById:
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixture.byId(id)))

  // Sobreescribir los modelos con los Stubs Agent & Metric
  const setupDataBase = proxyquire('../', {
    './models/metric': () => MetricStub, // Metric Sub reemplazara al metricModel
    './models/agent': () => AgentStub // Agent Sub reemplazara al agentModel
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
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed!')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the model')
  t.true(MetricStub.belongsTo.called, 'MetricModel.hasMany was executed!')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument shoul be the model (Agent)')
})

test.serial('Agent#findById', async t => {
  const agent = await db.Agent.findById(id)
  t.true(AgentStub.findById.called, 'findById should be called one model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called onece')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with an specific id')
  t.deepEqual(agent, agentFixture.byId(id), 'Shoul be the same')
})

test.serial('Agent#CreateOrUpdate - exists', async t => {
  let agent =  await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'findOne Should be called')
  t.true(AgentStub.findOne.calledTwice, 'findOne Should be called twice')
  t.true(AgentStub.update.calledOnce, 'update Should be called once')
  t.deepEqual(agent, single, 'Should be the same')
})

