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

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

// WebSocket
io.on('connect', socket => {
    debug(`Connected ${socket.id}`)

    socket.on('agent/message', payload => {
        console.log(payload)
    })

    setInterval(() => {
        socket.emit('agent/message', { agent: 'xxx-yyy'})
    }, 2000)
})

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse:web]')} server listening on port ${port}`)
})
