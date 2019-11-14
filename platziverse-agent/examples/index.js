const PlatziverseAgent = require('../')

const agent = new PlatziverseAgent ({
  name: 'myapp',
  username: 'admin',
  interval: 2000
})

// rss: Resident Set Size (porcion de memoria que ocupa un proceso en RAM)
// (topic, function), funcion indica que va hacer la metrica.
agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss
})

// Agregar metricas que soporten promesas
agent.addMetric('PromiseMetric', function getRandomPromise () {
  return Promise.resolve(Math.random())
})

// Agregar metricas que soporten callbacks
agent.addMetric('CallbackMetric', function getRandomCalback (callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// This agent only
agent.on('message', handler)
agent.on('connected', handler)
agent.on('disconnected', handler)

// Other agents
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', payload => {
  console.log(payload)
})

function handler (payload) {
  console.log(payload)
}

// setTimeout(() => agent.disconnect(), 50000)
