const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const startShell = require('./utils/startShell');

const DEFAULT_CHAINCODE_PATH = path.resolve(__dirname, '../example-chaincode/fabcar/node');
const LOCAL_CHAINCODE_PATH =  path.resolve(__dirname, '../chaincode');

module.exports = function setupDevEnv({chaincodeLocation = DEFAULT_CHAINCODE_PATH}) {
    let buildIteration = 0;

    const stat = fs.statSync(chaincodeLocation);
    if (!stat.isDirectory()) {
        throw new Error(`Invalid chain code location.`, chaincodeLocation);
    }

    const chaincodeDirectory = path.parse(chaincodeLocation).name;

    const shellEnvVariables = {
        'CHAINCODE_DIR': chaincodeDirectory,
        'CHAINCODE_JS': 'chaincode.js',
        'VERSION': buildIteration
    };

    console.log(`Running chaincode for location: ${chaincodeLocation}, directory: ${chaincodeDirectory}`);

    const copyChainCode = () => {
        return new Promise((resolve, reject) => {
            const targetDir = path.join(LOCAL_CHAINCODE_PATH, chaincodeDirectory);
            fs.ensureDirSync(targetDir);
            fs.copy(chaincodeLocation, targetDir, (err) => {
                if (err) {
                    console.log('Failed to copy chaincode files', err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    const initChainCode = () => {
        return new Promise((resolve, reject) => {
            startShell('./scripts/deployChainCode.sh', shellEnvVariables, 5000)
                .then(() => startShell('./scripts/initChainCode.sh', shellEnvVariables))
                .then(resolve)
                .catch((err) => {
                    console.log(`Initializing chaincode failed`, err);
                    reject(err);
                });
        });
    };

    const upgradeChainCode = () => {
        return new Promise((resolve, reject) => {
            // Bump the chaincode version
            shellEnvVariables.VERSION = buildIteration;
            startShell('./scripts/deployChainCode.sh', shellEnvVariables, 5000)
                .then(() => startShell('./scripts/upgradeChainCode.sh', shellEnvVariables))
                .then(resolve)
                .catch((err) => {
                    console.log(`Upgrading chaincode failed`, err);
                    reject(err);
                });
        });
    };

    // Upgrade chaincode whenever source files change
    chokidar.watch([
        path.join(chaincodeLocation, '**/*.js'),
        `!${path.join(chaincodeLocation, 'node_modules/**')}`
    ], {ignoreInitial: true})
        .on('all', (event, path) => {
            console.log('Upgrading chaincode for ', path);
            buildIteration += 1;
            // TODO: only copy changed file
            copyChainCode().then(() => {
                upgradeChainCode()
                    .then(() => console.log('Chaincode upgraded'))
                    .catch((err) => console.log(err));
            }).catch(err => console.log(err));
        });

    // Start docker
    startShell('./scripts/setupDocker.sh', shellEnvVariables, 10000)
        .then(copyChainCode)
        .then(() => startShell('./scripts/installNpmPackages.sh', shellEnvVariables))
        .then(initChainCode)
        .catch(() => process.exit(1));
}
