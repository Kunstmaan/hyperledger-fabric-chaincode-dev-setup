const path = require('path');
const fs = require('fs-extra');

module.exports = function getChaincodeName(chaincodeLocation) {
    const packageJsonPath = path.join(chaincodeLocation, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        return require(packageJsonPath).name;
    } else {
        // Use the directory name
        return path.parse(chaincodeLocation).name;
    }
};
