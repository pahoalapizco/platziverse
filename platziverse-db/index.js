'use strict'

const setupDataBase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupAgentService = require('./lib/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults'
)
module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      row: true // Regrese un obj json básico
    }
  })
  const sequelize = setupDataBase(config)
  const agentModel = setupAgentModel(config)
  const metricModel = setupMetricModel(config)

  agentModel.hasMany(metricModel)
  metricModel.belongsTo(agentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgentService(agentModel)
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
