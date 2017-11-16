const path = require('path');
const {SCRIPTS_PATH} = require('./constants');
const startShell = require('./utils/startShell');

module.exports = function upgradeChaincode(chaincodeLocation, version) {
    const chaincodeName = require(path.join(chaincodeLocation, 'package.json')).name;

    const shellEnvVariables = {
        'CHAINCODE_NAME': chaincodeName,
        'CHAINCODE_JS': 'chaincode.js',
        'VERSION': version
    };

    console.log(`Upgrading chaincode for ${chaincodeName} with env variables: ${JSON.stringify(shellEnvVariables)}`);

    return new Promise((resolve, reject) => {
        startShell(path.join(SCRIPTS_PATH, 'deployChaincode.sh'), shellEnvVariables, 5000)
            .then(() => startShell(path.join(SCRIPTS_PATH, 'upgradeChaincode.sh'), shellEnvVariables))
            .then(resolve)
            .catch((err) => {
                console.log(`Upgrading chaincode failed`, err);
                reject(err);
            });
    });
};