'use strict'

const setupDataBase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupAgentService = require('./lib/agent')
const setupMetricModel = require('./models/metric')
const setupMetricService = require('./lib/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite', // for unit test
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
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgentService(AgentModel)
  const Metric = setupMetricService(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
