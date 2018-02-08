const path = require('path');
const locateConfig = require('../utils/locateConfig');
const {build} = require('../utils/build');

const CONSTANTS = require('../constants');

module.exports.command = 'build';
module.exports.describe = 'Build the project';

module.exports.handler = function() {
    console.log('executing build');

    return locateConfig('./').then(({configPath, configContents}) => {
        const cwdPath = path.dirname(configPath);

        return build(
            path.resolve(cwdPath, configContents[CONSTANTS.CONFIG_SOURCE_PATH_KEY]),
            path.resolve(cwdPath, configContents[CONSTANTS.CONFIG_BUILD_PATH_KEY]),
            configContents[CONSTANTS.CONFIG_CHAINCODES_KEY]
        ).then(() => {
            console.log('Done building!');
        });
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
