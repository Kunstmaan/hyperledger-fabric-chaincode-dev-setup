const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const startShell = require('./utils/startShell');
const setLogOutputToConsole = require('./utils/startShell').setLogOutputToConsole;
const copyChaincode = require('./copyChaincode');
const initChaincode = require('./initChaincode');
const upgradeChaincode = require('./upgradeChaincode');
const installNpmPackages = require('./installNpmPackages');
const {SCRIPTS_PATH, LOCAL_CHAINCODE_PATH, DOCKER_SETUP_FINISHED_REGEX} = require('./constants');

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
    }
}) {
    setLogOutputToConsole(logOutputToConsole);

    chaincodeLocations.forEach((location) => {
        const stat = fs.statSync(location);
        if (!stat.isDirectory()) {
            throw new Error(`Invalid chain code location.`, location);
        }
    });

    console.log(`Running chaincode for location(s): ${chaincodeLocations.join(', ')}`);

    const copyAllChaincode = () => Promise.all(chaincodeLocations.map(location => copyChaincode(location)));
    const initAllChaincode = () => Promise.all(chaincodeLocations.map(location => initChaincode(location)));
    const installAllNpmPackages = () => chaincodeLocations.reduce((p, location) => p.then(() => installNpmPackages(location)), Promise.resolve());

    // Start docker
    startShell(path.join(SCRIPTS_PATH, 'setupDocker.sh'), {}, DOCKER_SETUP_FINISHED_REGEX, 30000)
        .then(copyAllChaincode)
        .then(installAllNpmPackages)
        .then(initAllChaincode)
        .then(() => {
            // start watching

            // Upgrade chaincode whenever source files change
            chaincodeLocations.forEach((location, index) => {
                let upgradePromise = Promise.resolve();

                let version = 0;
                chokidar.watch([
                    path.join(location, '**/*.js'),
                    `!${path.join(location, 'node_modules/**')}`
                ], {ignoreInitial: true})
                    .on('all', (event, path) => {
                        upgradePromise = upgradePromise.then(() => {
                            // Increase version number
                            version += 1;

                            console.log(`Upgrading chaincode for ${location} to version ${version}`);
                            // TODO: only copy changed file
                            return copyChaincode(location).then(() => {

                                return upgradeChaincode(location, version)
                                    .then(() => console.log(`Chaincode upgraded successful to version ${version}`))
                            }).catch(err => {
                                console.log(`Chaincode upgrade to version ${version} failed`);
                                console.log(err);

                                return Promise.resolve();
                            });
                        });
                    });
            });
        })
        .catch(() => process.exit(1));
}
