'use strict'

const { config } = require('./lib/db')
const { handleFatalError } = require('./lib/request')

module.exports = {
    config,
    handleFatalError
}