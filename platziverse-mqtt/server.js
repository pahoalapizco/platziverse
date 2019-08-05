'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca') // brocker con el el server mqtt
const redis = require('redis')
const chalk = require('chalk')

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

server.on('ready', () => {
  console.log(`${chalk.green('[platziverse-mqtt]')} server is running`)
})

server.on('error', handleFatalError)

function handleFatalError(err) {
  console.error(`${chalk.red('[Fatal Error]: ')} ${err.message}`)
  console.error(`${err.stack}`)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)