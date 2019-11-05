'use strict'
const agentFixture = require('./agent')

const metric = {
  id: 1,
  agentId: 1,
  type: 'Memory',
  value: '3000',
  createAt: new Date(),
  updateAt: new Date()
}

const metrics = [
  metric,
  extend(metric, { id: 2, value: '2000' }),
  extend(metric, { id: 3, agentId: 2, type: 'CPU', value: '1gh', createAt: new Date('2019-01-01') }),
  extend(metric, { id: 4, agentId: 2, type: 'CPU', value: '2gh' }),
  extend(metric, { id: 5, agentId: 3, type: 'speed', value: '86mb' }),
  extend(metric, { id: 6, agentId: 4, type: 'speed', value: '45mb' })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

function findAgentId (uuid) {
  const agent = agentFixture.byUUid(uuid)

  return agent === undefined ? 0 : agent.id
}

function byAgentUuid (uuid) {
  const agentId = findAgentId(uuid)

  if (agentId) {
    const types = new Set(metrics.filter(m => m.agentId === agentId).map(m => m.type))
    return [...types]
  }

  return []
}

function byTypeAgentUuid (type, uuid) {
  const agentId = findAgentId(uuid)

  if (agentId) {
    return metrics.filter(m => m.agentId === agentId)
      .filter(m => m.type === type)
      .map(m => ({
        id: m.id,
        type: m.type,
        value: m.value,
        createdAt: m.createdAt
      }))
      .sort((a, b) => b - a)
      .slice()
  }
}

module.exports = {
  single: metric,
  all: metrics,
  byAgentUuid,
  byTypeAgentUuid
}
