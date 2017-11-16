const argv = require('yargs').argv;
const setupDevEnv = require('./lib');

setupDevEnv({chaincodeLocations: argv.chaincodeLocation});