const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const startShell = require('./utils/startShell');
const copyChaincode = require('./copyChaincode');
const initChaincode = require('./initChaincode');
const upgradeChaincode = require('./upgradeChaincode');
const installNpmPackages = require('./installNpmPackages');
const {SCRIPTS_PATH, LOCAL_CHAINCODE_PATH} = require('./constants');

const DEFAULT_CHAINCODE_PATHS = [
    path.resolve(__dirname, '../example-chaincode/fabcar1'),
    path.resolve(__dirname, '../example-chaincode/fabcar2')
];

module.exports = function setupDevEnv({chaincodeLocations = DEFAULT_CHAINCODE_PATHS}) {
    chaincodeLocations.forEach((location) => {
        const stat = fs.statSync(location);
        if (!stat.isDirectory()) {
            throw new Error(`Invalid chain code location.`, location);
        }
    });

    console.log(`Running chaincode for location(s): ${chaincodeLocations.join(', ')}`);

    const copyAllChaincode = () => Promise.all(chaincodeLocations.map(location => copyChaincode(location)));
    const initAllChaincode = () => Promise.all(chaincodeLocations.map(location => initChaincode(location)));
    const installAllNpmPackages = () => Promise.all(chaincodeLocations.map(location => installNpmPackages(location)));

    // Upgrade chaincode whenever source files change
    chaincodeLocations.forEach((location, index) => {
        let version = 0;
        chokidar.watch([
            path.join(location, '**/*.js'),
            `!${path.join(location, 'node_modules/**')}`
        ], {ignoreInitial: true})
            .on('all', (event, path) => {
                console.log('Upgrading chaincode for ', location);
                // Increase version number
                version += 1;
                // TODO: only copy changed file
                copyChaincode(location).then(() => {
                    upgradeChaincode(location, version)
                        .then(() => console.log('Chaincode upgraded'))
                        .catch((err) => console.log(err));
                }).catch(err => console.log(err));
            });
    });

    //installNpmPackages(chaincodeLocations[0]).then(() => 'npm installed').catch((err) => console.log('shit', err));
    // installAllNpmPackages().then(() => 'npm installed').catch((err) => console.log('shit', err));

    // Start docker
    startShell(path.join(SCRIPTS_PATH, 'setupDocker.sh'), {}, 10000)
        .then(copyAllChaincode)
        .then(installAllNpmPackages)
        .then(initAllChaincode)
        .catch(() => process.exit(1));
}
