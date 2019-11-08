'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const auth = require('express-jwt') //middleware para autenticar rutas
const guard = require('express-jwt-permissions')() //middelware para autorizar rutas, para utilizar este mw nececitamos del mw anterior
const asyncify = require('express-asyncify')
const {
  AgentNotFoundError,
  MetricsNotFoundError,
  NotAuthorizedError,
  config
} = require('platziverse-utils')
const db = require('platziverse-db')

const api = asyncify(express.Router())

let services, Agent, Metric

const loggin = s => debug(s)
const authsecret = config().auth
// *: Cada que se solicite una petición se ejecuta el middleware
api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Conectado a la base de datos...')
    try {
      services = await db(config({ loggin }))
    } catch (e) {
      next(e)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', auth(authsecret), async (req, res, next) => {
  debug('A request has come to /agents')
  
  const { user } = req

  if (!user || !user.username) {
    return next(new NotAuthorizedError())
  }

  let agents = []
  try {
    if (user.admin) {
      agents = await Agent.findConnected()
    } else {
      agents = await Agent.findUser(user.username)
    }
  } catch (e) {
    next(e)
  }
  res.status(200).send(agents)
})
api.get('/agents/:uuid', auth(authsecret), async (req, res, next) => {
  const { uuid } = req.params
  let agent

  debug(`Petición a /agents/${uuid}`)

  try {
    agent = await Agent.findByUuId(uuid)
  } catch (e) {
    next(e)
  }

  if (!agent) {
    return next(new AgentNotFoundError(uuid))
  }

  res.send(agent)
})
api.get('/metrics/:uuid', auth(authsecret), guard.check(['metrics:read']), async (req, res, next) => {
  const { uuid } = req.params
  let metrics = []
  debug(`Petición a /metrics/${uuid}`)

  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new MetricsNotFoundError(uuid))
  }

  res.send(metrics)
})
api.get('/metrics/:uuid/:type', auth(authsecret), guard.check(['metrics:read']), async (req, res, next) => {
  const { uuid, type } = req.params
  let metrics = []
  debug(`Petición a /metrics/${uuid}/${type}`)

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    next(e)
  }

  if (!metrics || metrics.length === 0) {
    return next(new MetricsNotFoundError(uuid, type))
  }

  res.send(metrics)
})

module.exports = api
