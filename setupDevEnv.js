const path = require('path');
const argv = require('yargs').argv;
const setupDevEnv = require('./lib');

const chaincodeLocationArg = argv.chaincodeLocation;

let chaincodeLocations = undefined;

if (Array.isArray(chaincodeLocationArg)) {
    chaincodeLocations = chaincodeLocationArg.map((location => path.resolve(location)));
} else if (typeof chaincodeLocationArg === 'string') {
    chaincodeLocations = [path.resolve(chaincodeLocationArg)];
}

setupDevEnv({chaincodeLocations});
