const path = require('path');
const startShell = require('./startShell');
const {SCRIPTS_PATH} = require('./../constants');
const getChaincodeName = require('./getChaincodeName');

module.exports = function installNpmPackages(chaincodeLocation) {
    const chaincodeName = getChaincodeName(chaincodeLocation);

    const shellEnvVariables = {
        'CHAINCODE_NAME': chaincodeName
    };

    console.log(`Installing npm packages for ${chaincodeName}`);

    return startShell(path.join(SCRIPTS_PATH, 'installNpmPackages.sh'), shellEnvVariables);
};
