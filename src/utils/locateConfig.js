const fs = require('fs-extra');
const findUp = require('find-up');
const path = require('path');

const CONSTANTS = require('../constants');

module.exports = function locateConfig(cwdPath) {

    return findUp('package.json', {
        'cwd': cwdPath
    }).then((filePath) => {
        if (filePath) {

            return fs.readFile(filePath, 'utf8')
                .then((rawContents) => {
                    const contents = JSON.parse(rawContents);

                    if (contents[CONSTANTS.CONFIG_KEY]) {

                        return {
                            'configPath': filePath,
                            'configContents': contents[CONSTANTS.CONFIG_KEY]
                        };
                    }

                    return locateConfig(path.resolve(path.dirname(filePath), '../'));
                });
        }

        throw new Error('Config not found');
    });
};
