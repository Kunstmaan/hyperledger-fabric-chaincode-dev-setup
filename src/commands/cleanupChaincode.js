const path = require('path');
const fs = require('fs-extra');
const locateConfig = require('../utils/locateConfig');

const CONSTANTS = require('../constants');

module.exports.command = 'cleanup-chaincode';
module.exports.describe = 'cleanup the chaincode on the development network';

module.exports.handler = function() {
    console.log('executing cleanup-chaincode');

    return locateConfig('./').then(({configPath, configContents}) => {

        return path.resolve(path.dirname(configPath), configContents[CONSTANTS.CONFIG_CHAINCODE_DESTINATION_KEY]);
    }).catch(() => {
        // If no config is found cleanup default chaincode

        return CONSTANTS.DEFAULT_CHAINCODE_DESTINATION_PATH;
    }).then((chaincodePath) => {
        console.log(`cleaning up ${chaincodePath}`);

        return fs.remove(chaincodePath);
    });
};
