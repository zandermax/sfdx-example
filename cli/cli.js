#! /usr/bin/env node

const config = require('../config/config')
const dxez = require('sfdx-ez')
const shell = require('shelljs')
const yargs = require('yargs')

// dxez.project.setProjectPath(config.projectPath)

yargs.command(
  '$0 [orgname] [alias|org|a]',
  'Performs SFDX commands. By default, this command lists the status of a connected org.',
  yargs => {
    yargs.positional('orgname', {
      describe: 'Alias of the org of which to check status'
    })
    yargs.option('alias', {
      alias: ['a', 'org'],
      describe: 'Alias of the org of which to check status'
    })
  },
  argv => {
    argv.alias = argv.alias || argv.orgname
    dxez.status(argv)
  }
)

// Import all commands
for (command of Object.keys(dxez)) {
  yargs.command(dxez[command].yargs)
}

yargs.commandDir('cmds')

// Set all global command options
yargs
  .wrap(yargs.terminalWidth())
  .version(false)
  .help()
  .alias('h', 'help')
  .strict().argv
