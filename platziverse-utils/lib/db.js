'use strict'
const defaults = require('defaults')

const config = (config) => {
  config = defaults(config, {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }
  )
  config.auth = {
    secret: process.env.SECRET || 'mySecret'
  }

  return config
}

module.exports = {
  config
}
