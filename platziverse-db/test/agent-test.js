'use strict'

const test = require('ava')
const proxyquire = require('proxyquire') // sobre escribe los require's que la función esta haciendo.
const sinon = require('sinon')
const { agentFixture } = require('platziverse-utils')

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
const username = 'test-name'
const uuidArgs = {
  where: { uuid }
}
const connectedArgs = {
  where: { connected: true }
}
const userArgs = {
  where: { username, connected: true }
}

const newAgent = {
  id: 5,
  uuid: 'yyy-yyy-yyy-xxxx',
  name: 'test',
  username: 'test-user',
  hostname: 'test-host',
  pid: 0,
  connected: false,
  createAt: new Date(),
  updateAt: new Date()
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

  // Model findByUuId Stub
  AgentStub.findByUuId = sandbox.stub()
  AgentStub.findByUuId.withArgs(uuid).returns(Promise.resolve(agentFixture.byUUid(uuid)))

  // Model findAll Stub
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixture.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentFixture.connected))
  AgentStub.findAll.withArgs(userArgs).returns(Promise.resolve(agentFixture.test))

  // Model create Stub
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON () { return newAgent }
  }))

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

test.serial('Agent#Setup', async t => {
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
  const agent = await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'findOne Should be called')
  t.true(AgentStub.findOne.calledTwice, 'findOne Should be called twice')
  t.true(AgentStub.update.called, 'update Should be called')
  t.true(AgentStub.update.calledOnce, 'update Should be called once')
  t.deepEqual(agent, single, 'Should be the same')
})

test.serial('Agent#findByUuid', async t => {
  const agent = await db.Agent.findByUuId(uuid)
  t.true(AgentStub.findOne.called, 'findOne Should be called')
  t.true(AgentStub.findOne.calledOnce, 'findOne Should be called one')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne Should be called with an specific uuid')
  t.deepEqual(agent, agentFixture.byUUid(uuid), 'Should be the same!')
})

test.serial('Agent#findAll', async t => {
  const agents = await db.Agent.findAll()
  t.true(AgentStub.findAll.called, 'findAll Shoul be called')
  t.true(AgentStub.findAll.calledOnce, 'findAll Shoul be called once')
  t.true(AgentStub.findAll.calledWith(), 'findAll Shoul be called with out args')
  t.deepEqual(agents.length, agentFixture.all.length, 'Should be the same amount')
  t.deepEqual(agents, agentFixture.all, 'Should be the same')
})

test.serial('Agent#findConnected', async t => {
  const agents = await db.Agent.findConnected()
  t.true(AgentStub.findAll.called, 'findAll shoul be called')
  t.true(AgentStub.findAll.calledOnce, 'findAll shoul be called once')
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'findAll should be called once')
  t.deepEqual(agents, agentFixture.connected, 'Shoul be same amount')
})

test.serial('Agent#findUser', async t => {
  const agents = await db.Agent.findUser(username)
  t.true(AgentStub.findAll.called, 'findAll shoul be called in findUser')
  t.true(AgentStub.findAll.calledOnce, 'findAll shoul be called once in findUser')
  t.true(AgentStub.findAll.calledWith(userArgs), 'findAll shoul be called with an specific args in findUser')
  t.deepEqual(agents, agentFixture.test, 'Shoul be the same amount')
})
// ======= createOrUpdate - new =======
test.serial('Agent#creatOrupdate - new', async t => {
  const agent = await db.Agent.createOrUpdate(newAgent)
  t.true(AgentStub.findOne.called, 'findOne should be called')
  t.true(AgentStub.findOne.calledOnce, 'findOne shoul be called onece')
  t.true(AgentStub.findOne.calledWith({
    where: { uuid: newAgent.uuid }
  }), 'findOne shoul be called with an specific args')
  t.true(AgentStub.create.called, 'create shoul be called')
  t.true(AgentStub.create.calledOnce, 'create shoul be called once')
  t.true(AgentStub.create.calledWith(newAgent), 'create shoul be called once')
  t.deepEqual(agent, newAgent, 'agent shoul be the same')
})
