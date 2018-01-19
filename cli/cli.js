#! /usr/bin/env node

const sfdx = require('sfdx')
const yargs = require('yargs')

yargs.command(
  '$0 [orgname] [remote|r] [local|l] [alias|org|a]',
  'Performs SFDX commands. By default, this command lists the status of a connected org.',
  yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org of which to check status'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org of which to check status'
      })
      .option('remote', {
        alias: ['r'],
        describe: 'Fetch only changes made remotely',
        type: 'boolean'
      })
      .option('local', {
        alias: ['l'],
        describe: 'Fetch only changes in code locally',
        type: 'boolean'
      })
      .example('$0 status MyOrg', "- Gets the local and remote code status of 'MyOrg'")
      .example('$0 status --remote -a MyOrg', "- Gets the remote code status of 'MyOrg'")
  },
  argv => {
    argv.alias = argv.alias || argv.orgname
    sfdx.status(argv)
  }
)

// Import all commands
for (let command of Object.keys(sfdx)) {
  yargs.command(sfdx[command].yargs)
}

yargs.commandDir('cmds')

// Set all global command options
yargs
  .wrap(yargs.terminalWidth())
  .help()
  .alias('h', 'help')
  .strict().argv
