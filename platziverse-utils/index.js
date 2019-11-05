'use strict'

const { config } = require('./lib/db')
const { handleFatalError, handleError } = require('./lib/request')
const { parsePayload } = require('./lib/utils')
const {
  AgentNotFoundError,
  MetricsNotFoundError,
  NotAuthorizedError,
  NotAuthenticatedError
} = require('./lib/customErrors')
const agentFixture = require('./lib/fixtures/agent')
const metricFixture = require('./lib/fixtures/metric')

module.exports = {
  config,
  handleFatalError,
  handleError,
  parsePayload,
  AgentNotFoundError,
  MetricsNotFoundError,
  NotAuthorizedError,
  NotAuthenticatedError,
  agentFixture,
  metricFixture
}
