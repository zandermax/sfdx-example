const config = require('../../config/config')

const sfdx = require('sfdx')

exports.command = ['toproduction [prodorgname] [pushto|to|t] [force|f]', 'toprod', 'prod']

exports.describe = 'Converts local code and deploys it to a non-scratch org.'

exports.builder = yargs => {
  yargs
    .positional('prodorgname', {
      describe: 'Alias of the sandbox/production org to push code into'
    })
    .option('pushto', {
      alias: ['to', 't'],
      describe: 'Alias of the sandbox/production org to push code into'
    })
    .option('force', {
      alias: ['f'],
      describe: 'Force pull the code from the specified/default scratch org before pushing into the production/sandbox org',
      type: 'boolean'
    })
    .option('quiet', {
      alias: ['q'],
      describe: 'Quiet mode'
    })
    .help()
    .alias('h', 'help')
}

exports.handler = async argv => {
  argv.deployto = argv.pushto || argv.prodorgname
  if (!argv.deployto) {
    console.error('\n' + config.stars + 'ERROR: No org specified in which to deploy code.' + config.stars)
    process.exit(1)
  }

  // 1 - Convert pulled code
  const convertOutput = await sfdx.convert(argv)
  if (convertOutput.stderr) {
    if (!argv.quiet) {
      console.error('\n' + config.stars + 'ERROR: Code deployment failed.' + config.stars)
    }
    process.exit(1)
  }

  // 2 - Deploy converted Metadata API code into production org
  const deployOutput = await sfdx.deploy(argv)
  if (deployOutput.stderr) {
    if (!argv.quiet) {
      console.error('\n' + config.stars + 'ERROR: Code deployment failed.' + config.stars)
    }
    process.exit(1)
  } else {
    console.log('\n' + "Code successfully converted and deployed to '" + argv.deployto + "'.")
  }
}
