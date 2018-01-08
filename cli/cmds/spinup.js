const config = require('../../config/config')

const sfdx = require('sfdx')

exports.command = ['spinup [alias|org|a] [days|d] [open|o]', 'su']

exports.describe = 'Spins up a new scratch org and deploys local code into it.'

exports.builder = yargs => {
  yargs
    .positional('orgname', {
      describe: 'Alias of the scratch org to create and push code into'
    })
    .option('alias', {
      alias: ['org', 'a'],
      describe: 'Alias of the scratch org to create and push code into'
    })
    .option('days', {
      alias: ['d'],
      describe: 'Number of days to keep the new scratch org',
      type: 'number'
    })
    .option('defaultorg', {
      alias: ['f'],
      describe: 'Sets the newly-created scratch org as the default',
      type: 'boolean'
    })
    .option('open', {
      alias: ['o'],
      describe: 'Opens the org in a browser after creating it and pushing code into it',
      type: 'boolean'
    })
    .option('quiet', {
      alias: ['q'],
      describe: 'Quiet mode'
    })
    .help()
    .alias('h', 'help')
}

exports.handler = argv => {
  argv.alias = argv.alias || argv.orgname

  const createOutput = sfdx.create(argv)
  if (createOutput.stderr) {
    console.error('\n' + config.stars + 'ERROR creating scratch org' + config.stars)
  }

  const pushOutput = sfdx.push(argv)
  if (pushOutput.stderr) {
    console.error('\n' + config.stars + 'ERROR pushing to new scratch org' + config.stars)
    console.error(pushOutput.stderr)
  }

}
