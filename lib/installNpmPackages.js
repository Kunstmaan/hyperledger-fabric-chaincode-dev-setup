const path = require('path');
const startShell = require('./utils/startShell');
const {SCRIPTS_PATH} = require('./constants');

module.exports = function installNpmPackages(chaincodeLocation) {
    const chaincodeName = require(path.join(chaincodeLocation, 'package.json')).name;

    const shellEnvVariables = {
        'CHAINCODE_NAME': chaincodeName
    };

    console.log(`Installing npm packages for ${chaincodeName}`);

    return startShell(path.join(SCRIPTS_PATH, 'installNpmPackages.sh'), shellEnvVariables);
}