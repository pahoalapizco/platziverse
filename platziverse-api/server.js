'use strict'

const http = require('http')
const chalk = require('chalk')
const express = require('express')

const api = require('./api')

const { handleFatalError } = require('platziverse-utils')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

app.use('/api', api)

// midlewere manejador de errores
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

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
})
