const path = require('path');
const fs = require('fs');

module.exports = function hasCollectionsConfig(chaincodeLocation) {
    return fs.existsSync(path.resolve(chaincodeLocation, 'collections_config.json'));
};
