'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca') // brocker con el el server mqtt
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const {
  config,
  handleFatalError,
  handleError,
  parsePayload
} = require('platziverse-utils')

const loggin = s => debug(s)

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}
const settings = {
  port: 1883,
  backend
}

const server = mosca.Server(settings)
const clients = new Map() // Referencia a Agents conectados

let Agent, Metric

server.on('clientConnected', (client) => {
  debug(`Cliente Connected: ${client.id}`)
  clients.set(client.id, null)
})

server.on('clientDisconnected', (client) => {
  debug(`Client Disconected: ${client.id}`)
})

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`)

  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message':
      debug(`payload: ${packet.payload}`)
      await agentMessage(packet.payload, client)
      break
  }
})

server.on('ready', async () => {
  const services = await db(config({ loggin })).catch(handleFatalError)
  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})

server.on('error', handleFatalError)
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

const agentMessage = async (payload, client) => {
  payload = parsePayload(payload)
  console.log(`payload.agent: ${payload.agent}`)
  if (payload) {
    payload.agent.connected = true
  }

  const agent = await saveAgentConnected(payload)

  // Notify Agent is connected
  if (!clients.get(client.id)) {
    clients.set(client.id, agent)
    notifyAgent(agent)
  }
}

const saveAgentConnected = async (payload) => {
  let agent
  try {
    agent = await Agent.createOrUpdate(payload.agent)
  } catch (e) {
    return handleError
  }
  debug(`Agent ${agent.uui} saved`)
  return agent
}

const notifyAgent = (agent) => {
  server.publish({
    topic: 'agent/connected',
    payload: JSON.stringify({
      agent: {
        uuid: agent.uuid,
        username: agent.username,
        hostname: agent.hostname,
        pid: agent.pid,
        connected: agent.connected
      }
    })
  })
}
