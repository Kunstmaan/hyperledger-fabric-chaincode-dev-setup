const path = require('path');
const fs = require('fs-extra');

module.exports = function getChaincodeConfig(chaincodeLocation) {
    const packageJsonPath = path.join(chaincodeLocation, 'package.json');

    if (fs.existsSync(packageJsonPath)) {

        return require(packageJsonPath);
    }

    return undefined;
};
