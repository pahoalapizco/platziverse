'use strict'

const Sequelize = require('sequelize')
const setupDataBase = require('../lib/db')

module.exports = function setupAgenModel (config) {
  const sequelize = setupDataBase(config)

  // Define todo el modelo de Agent, (Mapeo Objeto-Relacional)
  return sequelize.define('agent', {
    uuid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hostname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    connected: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })
}
