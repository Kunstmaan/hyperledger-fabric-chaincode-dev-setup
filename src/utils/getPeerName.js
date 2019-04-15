const getChaincodeConfig = require('./getChaincodeConfig');

const CONSTANTS = require('./../constants/index');

module.exports = function getPeerName(chaincodeLocation) {
    const config = getChaincodeConfig(chaincodeLocation);

    if (config != null) {

        return config['hf-dev-peer-name'] || CONSTANTS.DEFAULT_PEER_NAME;
    }

    return CONSTANTS.DEFAULT_PEER_NAME;
};
