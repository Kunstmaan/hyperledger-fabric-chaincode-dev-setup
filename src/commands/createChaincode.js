const _ = require('lodash');
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
                replaceInFile(path.join(chaincodePath, 'chaincode.js'), {
                    'YOUR_CHAINCODE_NAME_PASCAL_CASED': _.upperFirst(_.camelCase(argv.chaincode))
                }),
                replaceInFile(path.join(chaincodePath, 'package.json'), {
                    'YOUR_CHAINCODE_NAME': argv.chaincode,
                    'YOUR_CHAINCODE_DESCRIPTION': argv.description || 'This chaincode will ...'
                }),
                replaceInFile(path.join(chaincodePath, 'README.md'), {
                    'YOUR_CHAINCODE_NAME': argv.chaincode,
                    'YOUR_CHAINCODE_DESCRIPTION': argv.description
                }),
                replaceInFile(
                    path.join(__dirname, '../templates/createChaincode/test.js'),
                    {
                        'YOUR_CHAINCODE_NAME': argv.chaincode,
                        'YOUR_CHAINCODE_DESCRIPTION': argv.description
                    },
                    path.join(path.dirname(configPath), configContents[CONSTANTS.CONFIG_TEST_PATH_KEY], `${argv.chaincode}.test.js`)
                )
            ]);
        }).then(() => {

            return fs.readFile(configPath, 'utf8').then((contents) => {
                const packageContents = JSON.parse(contents);
                packageContents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_CHAINCODES_KEY] = packageContents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_CHAINCODES_KEY] || [];
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

function replaceInFile(sourcePath, replacements = {}, destinationPath) {


    return fs.readFile(sourcePath, 'utf8').then((content) => {

        let updatedContent = content;
        Object.getOwnPropertyNames(replacements).forEach((searchString) => {
            const replacementString = replacements[searchString];

            updatedContent = updatedContent.replace(new RegExp(`(${searchString})`, 'gi'), replacementString);
        });

        return fs.writeFile(destinationPath || sourcePath, updatedContent, {
            encoding: 'utf8'
        });
    });
}
