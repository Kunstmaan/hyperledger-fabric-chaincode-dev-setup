const path = require('path');
const chokidar = require('chokidar');

const setupDevEnv = require('../lib/setupDevEnv');
const locateConfig = require('../utils/locateConfig');
const {build, buildChaincode, buildCommon} = require('../utils/build');

const CONSTANTS = require('../constants');

module.exports.command = 'start-dev';
module.exports.describe = 'Start development network';
module.exports.builder = {
    'chaincodePath': {
        'alias': 'cp',
        'type': 'array',
        'describe': 'Define the paths of the chaincodes you want to run in the test network'
    },
    'watch': {
        'alias': 'w',
        'type': 'boolean',
        'describe': 'Auto upgrade chaincode',
        'default': false
    }
};

module.exports.handler = function(argv) {
    console.log(`executing start-dev with watch mode ${argv.watch ? 'on' : 'off'}`);

    if (argv.chaincodePath) {

        // run simple network
        return setupDevEnv({
            'chaincodeLocations': argv.chaincodePath.map((cp) => {

                return path.resolve(cp);
            }),
            'watchMode': argv.watch
        }).then(() => {
            console.log('Dev env started.');
        }).catch(() => {
            process.exit(1);
        });
    }

    // locate configuration and use that
    return locateConfig('./').then(({configPath, configContents}) => {
        const cwdPath = path.dirname(configPath);
        const sourcePath = path.resolve(cwdPath, configContents[CONSTANTS.CONFIG_SOURCE_PATH_KEY]);
        const buildPath = path.resolve(cwdPath, configContents[CONSTANTS.CONFIG_BUILD_PATH_KEY]);
        const chaincodes = configContents[CONSTANTS.CONFIG_CHAINCODES_KEY];
        const chaincodesBasePath = path.resolve(sourcePath, CONSTANTS.CHAINCODES_DIR_NAME);
        const copyGlobPattern = configContents[CONSTANTS.CONFIG_COPY_GLOB_PATTERN_KEY] || CONSTANTS.DEFAULT_COPY_GLOB_PATTERN;
        const buildIgnorePatterns = configContents[CONSTANTS.CONFIG_BUILD_IGNORE_PATTERNS_KEY] || [];
        const buildIgnorePatternsRegexes = buildIgnorePatterns.map((pattern) => new RegExp(pattern, 'i'));

        const dockerFile = configContents[CONSTANTS.CONFIG_DOCKER_FILE_KEY] ? path.resolve(cwdPath, configContents[CONSTANTS.CONFIG_DOCKER_FILE_KEY]) : CONSTANTS.DEFAULT_DOCKER_FILE;
        const chaincodeDestination = configContents[CONSTANTS.CONFIG_CHAINCODE_DESTINATION_KEY] ? path.resolve(cwdPath, configContents[CONSTANTS.CONFIG_CHAINCODE_DESTINATION_KEY]) : CONSTANTS.DEFAULT_CHAINCODE_DESTINATION_PATH;

        return build(sourcePath, buildPath, buildIgnorePatternsRegexes, chaincodes).then(() => {
            const buildedChaincodeLocations = chaincodes.map((chaincode) => {

                return path.resolve(buildPath, chaincode);
            });

            return setupDevEnv({
                'chaincodeLocations': buildedChaincodeLocations,
                'dockerFile': dockerFile,
                'chaincodeDestination': chaincodeDestination,
                'copyGlobPattern': copyGlobPattern,
                'watchMode': argv.watch
            });
        }).then(() => {
            const filesToWatch = [];

            chaincodes.forEach((chaincode) => {
                const chaincodePath = path.join(chaincodesBasePath, chaincode);

                filesToWatch.push(path.join(chaincodePath, '**/*.js'));
                filesToWatch.push(path.join(chaincodePath, 'package.json'));
                filesToWatch.push(`!${path.join(chaincodePath, 'playground.js')}`);
                filesToWatch.push(`!${path.join(chaincodePath, 'node_modules/**')}`);
            });

            const updateChaincodeFile = (filePath) => {
                const updatedChaincode = chaincodes.find((c) => {
                    const chaincodePath = path.join(chaincodesBasePath, c);

                    return filePath.startsWith(chaincodePath);
                });

                if (updatedChaincode) {
                    console.log(`Updating file ${filePath} for chaincode ${updatedChaincode}`);

                    buildChaincode(updatedChaincode, sourcePath, buildPath, buildIgnorePatternsRegexes, filePath)
                        .catch((err) => {
                            console.log(`Updating file failed: ${err.message}`);
                        });
                }
            };

            chokidar.watch(filesToWatch, {
                ignoreInitial: true,
                followSymlinks: false
            })
                .on('add', updateChaincodeFile)
                .on('change', updateChaincodeFile);


            const updateCommon = () => {
                console.log('Updating common');

                buildCommon(chaincodes, sourcePath, buildPath, buildIgnorePatternsRegexes).catch((err) => {
                    console.log(`Updating common failed: ${err.message}`);
                });
            };

            chokidar.watch([
                path.join(sourcePath, 'common/**/*.js'),
                path.join(sourcePath, 'common/package.json'),
                `!${path.join(sourcePath, 'common/node_modules/**')}`
            ], {
                ignoreInitial: true
            })
                .on('add', updateCommon)
                .on('change', updateCommon);
        });
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
