const path = require('path');
const fs = require('fs-extra');
const locateConfig = require('../utils/locateConfig');

const CONSTANTS = require('../constants');

module.exports.command = 'create-chaincode <chaincode>';
module.exports.describe = 'Create new chaincode';
module.exports.builder = {
    'description': {
        'alias': 'd',
        'type': 'string',
        'describe': 'The chaincode description'
    }
};

module.exports.handler = function(argv) {
    console.log('executing create-chaincode');

    return locateConfig('./').then(({configPath, configContents}) => {
        const chaincodePath = path.resolve(path.dirname(configPath), configContents[CONSTANTS.CONFIG_SOURCE_PATH_KEY], CONSTANTS.CHAINCODES_DIR_NAME, argv.chaincode);

        if (fs.existsSync(chaincodePath)) {
            throw new Error(`Chaincode with name ${argv.chaincode} already exists!`);
        }

        return fs.copy(path.resolve(__dirname, '../templates/createChaincode/chaincode'), chaincodePath, {
            'overwrite': true
        }).then(() => {

            return Promise.all([
                fs.readFile(path.join(chaincodePath, 'package.json'), 'utf8').then((content) => {
                    const updatedContent = content.replace(/(YOUR_CHAINCODE_NAME)/i, argv.chaincode).replace(/(YOUR_CHAINCODE_DESCRIPTION)/i, argv.description || 'This chaincode will ...');

                    return fs.writeFile(path.join(chaincodePath, 'package.json'), updatedContent, {
                        encoding: 'utf8'
                    });
                }),
                fs.readFile(path.join(chaincodePath, 'README.md'), 'utf8').then((content) => {
                    const updatedContent = content.replace(/(YOUR_CHAINCODE_NAME)/i, argv.chaincode);

                    return fs.writeFile(path.join(chaincodePath, 'README.md'), updatedContent, {
                        encoding: 'utf8'
                    });
                }),
                fs.readFile(path.join(__dirname, '../templates/createChaincode/test.js'), 'utf8').then((content) => {
                    const updatedContent = content.replace(/(YOUR_CHAINCODE_NAME)/i, argv.chaincode);

                    return fs.writeFile(path.join(path.dirname(configPath), configContents[CONSTANTS.CONFIG_TEST_PATH_KEY], `${argv.chaincode}.test.js`), updatedContent, {
                        encoding: 'utf8'
                    });
                })
            ]);
        }).then(() => {

            return fs.readFile(configPath, 'utf8').then((contents) => {
                const packageContents = JSON.parse(contents);
                packageContents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_CHAINCODES_KEY] = packageContents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_CHAINODES_KEY] || [];
                packageContents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_CHAINCODES_KEY].push(argv.chaincode);

                return fs.writeFile(configPath, JSON.stringify(packageContents, null, 4), {
                    encoding: 'utf8'
                }).then(() => {
                    console.log(`New chaincode with name ${argv.chaincode} created!`);
                });
            });
        });
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
