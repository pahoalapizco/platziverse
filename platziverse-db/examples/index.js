'use strict'

// Ejemplo de uso del módulo BD

const db = require('../')

async function run(){
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }
  const { Agent, Metric } = await db(config).catch(handleFatalError)
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
    value:'150'
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

function handleFatalError(err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}


run()