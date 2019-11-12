'use strict'

const debug = require('debug')('platziverse:web')
const http = require('http')
const chalk = require('chalk')
const express = require('express')
const asyncify = require('express-asyncify')
const path = require('path')
const socketio = require('socket.io')
const proxy = require('./proxy')
const {
  handleFatalError,
  handleError,
  pipe
} = require('platziverse-utils')
const PlatziverseAgent = require('platziverse-agent')

const port = process.env.PORT || 8080
const app = asyncify(express())
const server = http.createServer(app)
const io = socketio(server)
const agent = new PlatziverseAgent()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)

// middlewere manejador de errores
app.use((err, req, res, next) => {
  if (err.message.match(/not found/)) {
    return res.status(404).send({
      error: err.message
    })
  }
  res.status(500).send({
    error: err.message
  })
})

// WebSocket
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse:web]')} server listening on port ${port}`)
  agent.connect()
})
