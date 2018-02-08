const getChaincodeConfig = require('./getChaincodeConfig');

const CONSTANTS = require('./../constants/index');

module.exports = function getChaincodeChannel(chaincodeLocation) {
    const config = getChaincodeConfig(chaincodeLocation);

    if (config != null) {

        return config['hf-dev-channel'] || CONSTANTS.DEFAULT_CHANNEL;
    }

    return CONSTANTS.DEFAULT_CHANNEL;
};
