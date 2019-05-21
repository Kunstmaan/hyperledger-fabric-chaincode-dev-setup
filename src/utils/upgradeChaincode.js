const path = require('path');

const {SCRIPTS_PATH, DEPLOY_FINISHED_REGEX} = require('./../constants');
const startShell = require('./startShell');
const getChaincodeName = require('./getChaincodeName');
const getChaincodeChannel = require('./getChaincodeChannel');
const getInstantiateArgsString = require('./getInstantiateArgsString');
const hasCollectionsConfig = require('./hasCollectionsConfig');

module.exports = function upgradeChaincode(chaincodeLocation, version) {
    const chaincodeName = getChaincodeName(chaincodeLocation);
    const chaincodeChannel = getChaincodeChannel(chaincodeLocation);
    const instantiateArgsString = getInstantiateArgsString(chaincodeLocation);
    const collectionsConfigFound = hasCollectionsConfig(chaincodeLocation);

    const shellEnvVariables = {
        'CHAINCODE_CHANNEL': chaincodeChannel,
        'CHAINCODE_NAME': chaincodeName,
        'INSTANTIATE_ARGS': instantiateArgsString,
        'HAS_COLLECTIONS_CONFIG': collectionsConfigFound,
        'VERSION': version
    };

    console.log(`Upgrading chaincode for ${chaincodeName} on channel ${chaincodeChannel} with env variables: ${JSON.stringify(shellEnvVariables)}`);

    return new Promise((resolve, reject) => {
        startShell(path.join(SCRIPTS_PATH, 'deployChaincode.sh'), shellEnvVariables, DEPLOY_FINISHED_REGEX, 30000)
            .then(() => startShell(path.join(SCRIPTS_PATH, 'upgradeChaincode.sh'), shellEnvVariables))
            .then(resolve)
            .catch((err) => {
                console.log('Upgrading chaincode failed', err);
                reject(err);
            });
    });
};
