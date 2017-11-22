const getChaincodeConfig = require('./getChaincodeConfig');
const constants = require('./../constants/index');

module.exports = function getChaincodeChannel(chaincodeLocation) {
    const config = getChaincodeConfig(chaincodeLocation);

    if (config != null) {

        return config['hf-dev-channel'] || constants.DEFAULT_CHANNEL;
    }

    return constants.DEFAULT_CHANNEL;
};
