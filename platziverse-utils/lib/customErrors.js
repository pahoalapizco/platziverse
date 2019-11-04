'use strict'

class AgentNotFoundError extends Error {
  constructor (uuid) {
    super()
    this.uuid = uuid
    this.errorCode = 404

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgentNotFoundError)
    }

    this.message = `Agent ${this.uuid} not found`
  }
}

class MetricsNotFoundError extends Error {
  constructor (uuid, type) {
    super()
    this.uuid = uuid
    this.type = type
    this.errorCode = 404

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MetricsNotFoundError)
    }

    this.message = `Metric ${this.type} not found for agent ${this.uuid} `
  }
}

class NotAuthorizedError extends Error {
  constructor () {
    super()
    this.httpStatusCode = 403

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotAuthorizedError)
    }

    this.message = 'User unauthorized to access the content'
  }
}

class NotAuthenticatedError extends Error {
  constructor () {
    super()
    this.httpStatusCode = 401

    this.message = 'User unauthenticated'
  }
}

module.exports = {
  AgentNotFoundError,
  MetricsNotFoundError,
  NotAuthorizedError,
  NotAuthenticatedError
}
