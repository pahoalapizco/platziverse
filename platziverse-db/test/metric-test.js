'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixture = require('./fixtures/agent')
const metricFixture = require('./fixtures/metric')

const config = {
  logging () {}
}

const newMetric = {
  id: 7,
  agentId: 1,
  type: 'Memory',
  value: '3000',
  createAt: new Date(),
  updateAt: new Date()
}

let db = null
let MetricStub = null
let AgentStub = null
let sandbox = null
const uuid = 'yyy-yyy-yyy-yyw' // agentId = 2
const type = 'CPU'

const uuidArgs = {
  where: { uuid }
}
const typeArgs = {
  attributes: ['id', 'type', 'value', 'createdAt'],
  where: { type },
  limit: 20,
  order: [['createdAt', 'DESC']],
  include: [{
    attributes: [],
    model: AgentStub,
    where: { uuid }
  }],
  row: true
}

const uuidTypeArgs = {
  attributes: ['type'], // Columnas que retorna
  group: ['type'],
  include: [{
    attributes: [],
    model: AgentStub,
    where: { uuid }
  }],
  raw: true
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  // se agregan los spy a cada stub
  MetricStub = {
    belongsTo: sandbox.spy()
  }
  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Agent: findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixture.byUUid(uuid)))

  typeArgs.include[0].model = AgentStub
  uuidTypeArgs.include[0].model = AgentStub

  // // Metric: findAll Stub
  MetricStub.findAll = sandbox.stub()
  MetricStub.findAll.withArgs(uuidTypeArgs).returns(Promise.resolve(metricFixture.byAgentUuid(uuid)))
  MetricStub.findAll.withArgs(typeArgs).returns(Promise.resolve(metricFixture.byTypeAgentUuid(type, uuid)))

  // Metric: create Stub
  MetricStub.create = sandbox.stub()
  MetricStub.create.withArgs(newMetric).returns(Promise.resolve({
    toJSON () { return newMetric }
  }))

  // Creamos la instancia a BD antes de comenzar las pruebas
  const setupDataBase = proxyquire('../', {
    './models/metric': () => MetricStub,
    './models/agent': () => AgentStub
  })
  db = await setupDataBase(config)
})

test.afterEach(async () => {
  sandbox && sinon.resetHistory()
})
test('Metric', t => {
  t.truthy(db.Metric, 'Metric service should exists!!')
})

test('Metric#Setup', async t => {
  t.true(AgentStub.hasMany.called, 'Agent.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Agent.hasMany was executed once')
  t.true(MetricStub.belongsTo.called, 'Metric.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Metric.belongsTo was executed once')
})

test.serial('Metric#findByAgentUuid', async t => {
  const metric = await db.Metric.findByAgentUuid(uuid)
  t.true(MetricStub.findAll.called, 'findAll shuld be called!')
  t.true(MetricStub.findAll.calledOnce, 'findAll shuld be called once!')
  t.true(MetricStub.findAll.calledWith(uuidTypeArgs), 'findAll shuld be called with an specific args!')
  t.deepEqual(metric, metricFixture.byAgentUuid(uuid))
})

test.serial('Metric#findByTypeAgentUuid', async t => {
  const metric = await db.Metric.findByTypeAgentUuid(type, uuid)
  t.true(MetricStub.findAll.called, 'findAll should be called')
  t.true(MetricStub.findAll.calledOnce, 'findAll should be called once')
  t.true(MetricStub.findAll.calledWith(typeArgs), 'findAll shoul be called with an specific args')
  t.deepEqual(metric, metricFixture.byTypeAgentUuid(type, uuid))
})

test.serial('Metric#create', async t => {
  const metric = await db.Metric.create(uuid, newMetric)
  t.true(AgentStub.findOne.called, 'Agent->findOne should be called')
  t.true(AgentStub.findOne.calledOnce, 'Agent->findOne should be called once')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'Agent->findOne should be called once')
  t.true(MetricStub.create.called, 'create shoul be called')
  t.true(MetricStub.create.calledOnce, 'create shoul be called once')
  t.true(MetricStub.create.calledWith(newMetric), 'create shoul be called once')
  t.deepEqual(metric, newMetric, 'Should be the same')
})
