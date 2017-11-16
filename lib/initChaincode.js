const path = require('path');
const {SCRIPTS_PATH} = require('./constants');
const startShell = require('./utils/startShell');
const getChaincodeName = require('./utils/getChaincodeName');

module.exports = function initChaincode(chaincodeLocation) {
    const chaincodeName = getChaincodeName(chaincodeLocation);

    const shellEnvVariables = {
        'CHAINCODE_NAME': chaincodeName,
        'CHAINCODE_JS': 'chaincode.js',
        'VERSION': 0
    };

    console.log(`Initializing chaincode for ${chaincodeName} with env variables: ${JSON.stringify(shellEnvVariables)}`);

    return new Promise((resolve, reject) => {
        startShell(path.join(SCRIPTS_PATH, 'deployChaincode.sh'), shellEnvVariables, 5000)
            .then(() => startShell(path.join(SCRIPTS_PATH, 'initChaincode.sh'), shellEnvVariables))
            .then(resolve)
            .catch((err) => {
                console.log(`Initializing chaincode failed`, err);
                reject(err);
            });
    });
};