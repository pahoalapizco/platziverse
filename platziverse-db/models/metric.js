'use strict'

const Sequelize = require('sequelize')
const setupDataBase = require('../lib/db')

module.exports = function setupMetricModel (config) {
  const sequelize = setupDataBase(config)

  // Mapeo de la tabla Metric a ORM
  return sequelize.define('metric', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
