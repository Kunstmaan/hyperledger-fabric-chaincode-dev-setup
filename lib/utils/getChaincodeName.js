const getChaincodeConfig = require('./getChaincodeConfig');

module.exports = function getChaincodeName(chaincodeLocation) {
    const config = getChaincodeConfig(chaincodeLocation);

    if (config != null) {
        
        return config.name;
    }

    // Use the directory name
    return path.parse(chaincodeLocation);
};
