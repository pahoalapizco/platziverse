'use strict'

// Test con un solo agente
const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy-yyy',
  name: 'test',
  username: 'test-user',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createAt: new Date(),
  updateAt: new Date()
}

// Test de varios agentes
const agents = [
  agent,
  extend(agent, { id: 2, uuid: 'yyy-yyy-yyy-yyw', name: 'test-test', username: 'test-name-test' }),
  extend(agent, { id: 3, uuid: 'yyy-yyy-yyy-yyx', name: 'test', username: 'test-name' }),
  extend(agent, { id: 4, uuid: 'yyy-yyy-yyy-yyz', name: 'test', connected: false })
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  test: agents.filter(a => a.username === 'test-name'),
  byUUid: id => agents.filter(a => a.uuid === id).shift(),
  byId: id => agents.filter(a => a.id === id).shift()
}
