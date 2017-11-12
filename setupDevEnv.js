const argv = require('yargs').argv;
const setupDevEnv = require('./lib');

setupDevEnv({chaincodeLocation: argv.chaincodeLocation});