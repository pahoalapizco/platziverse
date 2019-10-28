'use strict'

const debug = require('debug')('Platziverse:agent')
const os = require('os')
const util = require('util')
const mqtt = require('mqtt')
const defaults = require('defaults')
const { parsePayload } = require('platziverse-utils')
const uuid = require('uuid')
const EventEmitter = require('events')

const defOptions = {
  name: 'untitled',
  username: 'platzi',
  interval: 5000,
  mqtt: {
    host: 'mqtt://localhost'
  }
}

class PlatziverseAgent extends EventEmitter {
  constructor (options) {
    super()

    this._options = defaults(options, defOptions)
    this._started = false
    this._timer = null
    this._client = null
    this._agentId = null
    this._metrics = new Map()
  }

  addMetric () {
    this._metrics.set(type, fn)
  }

  removeMetric () {
    this._metrics.delete(type)
  }

  connect () {
    if (!this._started) {
      const opts = this._options
      this._started = true
      this._client = mqtt.connect(opts.mqtt.host)
      
      this._client.subscribe('agnet/message')
      this._client.subscribe('agnet/connected')
      this._client.subscribe('agnet/disconnected')
      
      this._client.on('connect', () => {
        this._agentId = uuid.v4()

        this.emit('connected', this._agentId)

        this._timer = setInterval(async () => {
          if (this._metrics.size > 0) {
            let message = {
              agent: {
                uuid: this._agentId,
                username: opts.username,
                name: opts.name,
                hostname: os.hostname() || 'localhost',
                pid: process.pid
              },
              metrics: [],
              timestamp: new Date().getTime()
            }
          }
          
          for ( let [ metric, fn ] of this._metrics) {
            if (fn.length == 1) { // cuando la longitud de la funcion es 1 entonces es un callbak
              fn = util.promisify(fn) // convierte un callback a una promesa
            }
            metric.message.push({
              type: metric,
              value: await Promise.resolve(fn())
            })
          }

        }, opts.interval)
      })

      this._client.on('message', (topic, payload) => {
        paylod = parsePayload(payload)
        
        // Re transmitir mensajes en nuestro agente!!
        let broadcast = false
        switch (topic) {
          case 'agent/message':
          case 'agent/connected':
          case 'agent/disconnected':
            broadcast = payload && payload.agent && payload.agent.uuid != this._agentId
            break
        }

        if (broadcast) {
          this.emit(topic, payload)
        }
      })
      this._client.on('error', () => this.disconnect())
    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
      this.emit('disconected')
    }
  }
}

module.exports = PlatziverseAgent
