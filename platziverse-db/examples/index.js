'use strict'

// Ejemplo de uso del módulo BD

const db = require('../')
const { config, handleFatalError } = require('platziverse-utils')

async function run () {
  const { Agent, Metric } = await db(config()).catch(handleFatalError)
  const agent = await Agent.createOrUpdate({
    uuid: 'xxxx',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.log('-- Agent --')
  console.log(agent)

  const agents = await Agent.findAll().catch(handleFatalError)

  console.log('-- Agents --')
  console.log(agents.dataValues)

  const metric = await Metric.create(agent.uuid, {
    type: 'CPU',
    value: '150'
  }).catch(handleFatalError)

  console.log('-- Metric --')
  console.log(metric)

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)
  console.log('-- Metrics --')
  console.log(metrics)

  const metricsByTyoe = await Metric.findByTypeAgentUuid('memory', agent.uuid)
  console.log('-- Metris by Type --')
  console.log(metricsByTyoe)
}

run()
