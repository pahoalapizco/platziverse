'use strict'

const debug = require('debug')('platziverse:db:setup') // namespace que indica donde se hará el debug
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')
const argv = require('yargs').boolean('y').argv

const prompt = inquirer.createPromptModule() // interactuar mediante cli

async function setup () {
  const opc = argv.y

  if ( !opc ){
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your database, are you sure? '
      }
    ])
    if (!answer.setup || opc) {
      return console.log('Nothing happend')
    }
  }


  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    loggin: s => debug(s),
    setup: true // Flag para determinar si se sincroniza o no la BD
  }

  await db(config).catch(handleFatalError)

  console.log('S U C C E S S !!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[Fatal Error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
