'use strict'
const chalk = require('chalk')

const handleFatalError = (err) => {
  console.error(`${chalk.red('[Fatal Error]: ')} ${err.message}`)
  console.error(`${err.stack}`)
  process.exit(1)
}

module.exports = {
  handleFatalError
}