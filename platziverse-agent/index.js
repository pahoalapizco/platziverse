'use strict'

const EventEmitter = require('events')

class PlatziverseAgent extends EventEmitter {
  constructor (options) {
    super()

    this._options = options
    this._started = false
    this._timer = null
  }

  connect () {
    if (!this._started) {
      this._started = true

      this.emit('connected')

      const opts = this._options
      this._timer = setInterval(() => {
        // this.emit('agent/message', () => {
        //   console.log('this is a message by pahoalapizco')
        // })
        this.emit('agent/message', 'this is a message by pahoalapizco ')
      }, opts.interval)
    }
  }

  disconnect () {
    if (this._started) {
      clearInterval(this._timer)
      this._started = false
    }
  }
}

module.exports = PlatziverseAgent
