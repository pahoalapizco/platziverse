'use strict'

const debug = require('debug')('platziverse:db:setup') // namespace que indica donde se hará el debug
const inquirer = require('inquirer')
const db = require('./')
const argv = require('yargs').boolean('y').argv
const { config, handleFatalError } = require('platziverse-utils')

const prompt = inquirer.createPromptModule() // interactuar mediante cli

async function setup () {
  const opc = argv.y

  if (!opc) {
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

  const loggin = s => debug(s)
  await db(config({ loggin })).catch(handleFatalError)

  console.log('S U C C E S S !!')
  process.exit(0)
}

setup()
