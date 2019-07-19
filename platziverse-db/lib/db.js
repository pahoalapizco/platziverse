'use strict'

const Sequelize = require('sequelize')
let sequelize = null // singleton: patron de diseño que nos permite restringir las instancias a un objeto.

module.exports = function setupDataBase (config) {
  if (!sequelize) {
    sequelize = Sequelize(config)
  }
  return sequelize
}
