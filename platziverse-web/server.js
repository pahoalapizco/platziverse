'use strict'

const debug = require('debug')('platziverse:web')
const http = require('http')
const chalk = require('chalk')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const {
    handleFatalError, 
    handleError
} = require('platziverse-utils')
const PlatziverseAgent = require('platziverse-agent')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new PlatziverseAgent()

app.use(express.static(path.join(__dirname, 'public')))

// WebSocket
io.on('connect', socket => {
    debug(`Connected ${socket.id}`)

   agent.on('agent/message', payload => {
        socket.emit('agent/message', payload)
   })

   agent.on('agent/connected', payload => {
        socket.emit('agent/connected', payload)
   })

   agent.on('agent/disconnected', payload => {
        socket.emit('agent/disconnected', payload)
   })

})

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse:web]')} server listening on port ${port}`)
  agent.connect()
})
