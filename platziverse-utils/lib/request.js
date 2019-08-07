'use strict'
const chalk = require('chalk')

const handleFatalError = (err) => {
  console.error(`${chalk.red('[Fatal Error]: ')} ${err.message}`)
  console.error(`${err.stack}`)
  process.exit(1)
}

const handleError = (err) => {
  console.error(`${chalk.red('[Error]: ')} ${err.message}`)
  console.error(`${err.stack}`)
}
module.exports = {
  handleFatalError,
  handleError
}
