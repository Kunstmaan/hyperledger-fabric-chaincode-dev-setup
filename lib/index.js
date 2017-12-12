const path = require('path');
const fs = require('fs-extra');
const startShell = require('./utils/startShell');
const setLogOutputToConsole = require('./utils/startShell').setLogOutputToConsole;
const copyChaincode = require('./copyChaincode');
const initChaincode = require('./initChaincode');
const watchChaincode = require('./watchChaincode');
const installNpmPackages = require('./installNpmPackages');
const {SCRIPTS_PATH, LOCAL_CHAINCODE_PATH, DOCKER_SETUP_FINISHED_REGEX, DEFAULT_CHAINCODE_DESTINATION_PATH, DEFAULT_DOCKER_FILE} = require('./constants');

const DEFAULT_CHAINCODE_PATHS = [
    path.resolve(__dirname, '../example-chaincode/fabcar1'),
    path.resolve(__dirname, '../example-chaincode/fabcar2')
];

module.exports = function setupDevEnv({
    chaincodeLocations = DEFAULT_CHAINCODE_PATHS,
    logOutputToConsole = (script, message) => {
        // Don't log debug messages
        if (message.indexOf(' DEBU ') !== -1) {
            return false;
        }
        return true;
    },
    watchMode = true,
    dockerFile = DEFAULT_DOCKER_FILE,
    chaincodeDestination = DEFAULT_CHAINCODE_DESTINATION_PATH,
    copyGlobPattern = undefined
}) {
    setLogOutputToConsole(logOutputToConsole);

    chaincodeLocations.forEach((location) => {
        const stat = fs.statSync(location);
        if (!stat.isDirectory()) {
            throw new Error(`Invalid chain code location.`, location);
        }
    });

    console.log(`Running chaincode for location(s): ${chaincodeLocations.join(', ')}`);

    const copyAllChaincode = () => chaincodeLocations.reduce((p, location) => p.then(() => copyChaincode(location, chaincodeDestination, copyGlobPattern)), Promise.resolve());
    const initAllChaincode = () => chaincodeLocations.reduce((p, location) => p.then(() => initChaincode(location)), Promise.resolve());
    const installAllNpmPackages = () => chaincodeLocations.reduce((p, location) => p.then(() => installNpmPackages(location)), Promise.resolve());

    // Start docker
    console.log(`Setting up docker ${dockerFile} with chaincode destination ${chaincodeDestination}`);
    startShell(path.join(SCRIPTS_PATH, 'setupDocker.sh'), {
        'HF_DOCKER_FILE': dockerFile
    }, DOCKER_SETUP_FINISHED_REGEX, 30000)
        .then(copyAllChaincode)
        .then(installAllNpmPackages)
        .then(initAllChaincode)
        .then(() => {
           if (watchMode) {
               return watchChaincode(chaincodeLocations, chaincodeDestination);
           }
           return Promise.resolve();
        })
        .catch(() => {
            process.exit(1);
        });
}
