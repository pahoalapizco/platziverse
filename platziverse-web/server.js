'use strict'

const debug = require('debug')('platziverse:web')
const http = require('http')
const chalk = require('chalk')
const express = require('express')
const path = require('path')
const {
    handleFatalError, 
    handleError
} = require('platziverse-utils')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse:web]')} server listening on port ${port}`)
})
