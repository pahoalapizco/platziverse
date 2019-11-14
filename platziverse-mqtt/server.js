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

server.on('clientDisconnected', async (client) => {
  debug(`Client Disconected: ${client.id}`)
  const agent = clients.get(client.id)

  if (agent) {
    // Mark Agent as disconnected
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (e) {
      return handleError(e)
    }
    // Delete agent from clientes
    clients.delete(client.id)

    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Cliente (${client.id}) associeted to Agent (${agent.uuid}) marked as disconnected.`)
  }
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
      await saveAgent(packet.payload, client)
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

const saveAgent = async (payload, client) => {
  payload = parsePayload(payload)
  let agent
  if (payload) {
    payload.agent.connected = true

    try {
      agent = await Agent.createOrUpdate(payload.agent)
    } catch (e) {
      return handleError(e)
    }

    debug(`Agent ${agent.uuid} saved`)

    // Notify Agent is connected
    if (!clients.get(client.id)) {
      clients.set(client.id, agent)
      notifyAgent(agent)
    }

    await saveMetrics(agent, payload)
  }
}

// Store Metrics
const saveMetrics = async (agent, payload) => {
  for (const metric of payload.metrics) {
    let m
    debug(`metrics: ${payload.metrics}`)
    try {
      m = await Metric.create(agent.uuid, metric)
    } catch (e) {
      return handleError(e)
    }
    debug(`Metric ${m.id} saved on Agent ${agent.uuid}`)
  }
}

const notifyAgent = (agent) => {
  server.publish({
    topic: 'agent/connected',
    payload: JSON.stringify({
      agent: {
        uuid: agent.uuid,
        name: agent.name,
        username: agent.username,
        hostname: agent.hostname,
        pid: agent.pid,
        connected: agent.connected
      }
    })
  })
}
