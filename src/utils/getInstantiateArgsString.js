const getChaincodeConfig = require('./getChaincodeConfig');

const CONSTANTS = require('./../constants/index');

module.exports = function getInstantiateArgsString(chaincodeLocation) {
    const config = getChaincodeConfig(chaincodeLocation);

    if (config != null && config['hf-dev-instantiateArgs'] != null) {

        return JSON.stringify(config['hf-dev-instantiateArgs']).replace('"', '\\"');
    }

    return CONSTANTS.DEFAULT_INSTANTIATE_ARGS;
};
