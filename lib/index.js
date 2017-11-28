const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const startShell = require('./utils/startShell');
const setLogOutputToConsole = require('./utils/startShell').setLogOutputToConsole;
const copyChaincode = require('./copyChaincode');
const initChaincode = require('./initChaincode');
const upgradeChaincode = require('./upgradeChaincode');
const installNpmPackages = require('./installNpmPackages');
const {SCRIPTS_PATH, LOCAL_CHAINCODE_PATH, DOCKER_SETUP_FINISHED_REGEX, DEFAULT_CHAINCODE_DESTINATION_PATH, DEFAULT_DOCKER_PATH} = require('./constants');

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
    dockerFile = DEFAULT_DOCKER_PATH,
    chaincodeDestination = DEFAULT_CHAINCODE_DESTINATION_PATH
}) {
    setLogOutputToConsole(logOutputToConsole);

    chaincodeLocations.forEach((location) => {
        const stat = fs.statSync(location);
        if (!stat.isDirectory()) {
            throw new Error(`Invalid chain code location.`, location);
        }
    });

    console.log(`Running chaincode for location(s): ${chaincodeLocations.join(', ')}`);

    const copyAllChaincode = () => chaincodeLocations.reduce((p, location) => p.then(() => copyChaincode(location, chaincodeDestination)), Promise.resolve());
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
            // start watching

            // Upgrade chaincode whenever source files change
            chaincodeLocations.forEach((location, index) => {
                // Chain the upgrade promises here ... else the chaincode becomes
                // corrupt when quickly changing the same chaincode twice and it tries to upgrade
                // 2 times asynchronously
                let upgradePromise = Promise.resolve();
                let previousUpgradeTimeout = null;

                let version = 0;
                chokidar.watch([
                    path.join(location, '**/*.js'),
                    `!${path.join(location, 'node_modules/**')}`
                ], {ignoreInitial: true})
                    .on('all', (event, path) => {
                        // Debounce upgrades when updates are done to the same chaincode to quick
                        if (previousUpgradeTimeout != null) {
                            clearTimeout(previousUpgradeTimeout);
                        }

                        previousUpgradeTimeout = setTimeout(() => {
                            previousUpgradeTimeout = null;

                            upgradePromise = upgradePromise.then(() => {
                                // Increase version number
                                version += 1;
    
                                console.log(`Upgrading chaincode for ${location} to version ${version}`);
                                // TODO: only copy changed file
                                return copyChaincode(location, chaincodeDestination).then(() => {
    
                                    return upgradeChaincode(location, version)
                                        .then(() => console.log(`Chaincode upgraded successful to version ${version}`))
                                }).catch(err => {
                                    console.log(`Chaincode upgrade to version ${version} failed`);
                                    console.log(err);
    
                                    return Promise.resolve();
                                });
                            });
                        }, 1000);
                    });
            });
        })
        .catch(() => process.exit(1));
}
