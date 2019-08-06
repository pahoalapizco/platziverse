'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca') // brocker con el el server mqtt
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const { config, handleFatalError } = require('platziverse-utils')

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

let Agent, Metric

server.on('clientConnected', (client) => {
  debug(`Cliente Connected: ${client.id}`)
})

server.on('clientDisconnected', (client) => {
  debug(`Client Disconected: ${client.id}`)
})

server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
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
