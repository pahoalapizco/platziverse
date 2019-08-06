'use strict'
const defaults = require('defaults')

const config = (config) => {
  return config = defaults(config, {
      database: process.env.DB_NAME || 'platziverse',
      username: process.env.DB_USER || 'platzi',
      password: process.env.DB_PASS || 'platzi',
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
  })
}

module.exports = {
  config
}