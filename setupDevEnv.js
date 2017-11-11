const {setTimeout} = require('timers');
const {spawn} = require('child_process');
const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const argv = require('yargs').argv;
const terminalTab = require('./scripts/utils/terminal-tab');

const DEFAULT_CHAINCODE_PATH = './example-chaincode/fabcar';
const LOCAL_CHAINCODE_PATH = './chaincode';

let buildIteration = 0;

const chaincodeLocation = argv.chaincodeLocation || path.resolve(__dirname, DEFAULT_CHAINCODE_PATH);

const stat = fs.statSync(chaincodeLocation);
if (!stat.isDirectory()) {
    throw new Error(`Invalid chain code location.`, chaincodeLocation);
}

const chaincodeDirectory = path.parse(chaincodeLocation).name;

console.log(`Running chaincode for location: ${chaincodeLocation}, directory: ${chaincodeDirectory}`);

const copyChainCode = () => {
    return new Promise((resolve, reject) => {
        const targetDir = path.join(__dirname, LOCAL_CHAINCODE_PATH, chaincodeDirectory);
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

const startShell = (script, timeout = undefined, outputToConsole = true) => {
    return new Promise((resolve, reject) => {
        const ls = spawn('sh', [script], {
            cwd: __dirname,
            env: {
                'VERSION': buildIteration,
                'CHAINCODE_DIR': chaincodeDirectory
            }
        });

        ls.stdout.on('data', (data) => {
            if (outputToConsole) {
                console.log(data.toString());
            }
        });

        ls.stderr.on('data', (data) => {
            if (outputToConsole) {
                console.log(data.toString());
            }
        });

        let exitedWithError = false;
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code !== 0) {
                reject('Process exited with an error');
            } else if (!timeout) {
                resolve();
            }
        });

        if (timeout) {
            setTimeout(() => {
                if (!exitedWithError) {
                    resolve();
                }
            }, timeout)
        }
    });
}

const openTerminal = () => {
    terminalTab.open(
        'echo -e You can now start executing chaincode;' +
        `echo See ${__dirname}/scripts/executeChainCode.sh for examples;` +
        `docker exec -it -e VERSION=${buildIteration} cli bash;`
    )
}

const initChainCode = (isUpdate = false) => {
    return new Promise((resolve, reject) => {
        startShell('./scripts/deployChainCode.sh', 5000)
            .then(() => startShell('./scripts/initChainCode.sh'))
            .then(openTerminal)
            .then(resolve)
            .catch((err) => {
                console.log(`Initializing chaincode failed`, err);
                if (!isUpdate) {
                    reject(err);
                }
            });
    });
};

// Update chaincode whenever source files change
chokidar.watch(path.join(chaincodeLocation, '**/node/*.js'), {ignoreInitial: true})
    .on('all', (event, path) => {
        console.log('Updating chaincode for ', path);
        buildIteration += 1;
        // TODO: only copy changed file
        copyChainCode().then(() => {
            initChainCode(true)
                .then(() => console.log('Chaincode updated'));
        }).catch(err => console.log(err));
    });

// Start docker
startShell('./scripts/setupDocker.sh', 10000)
    .then(copyChainCode)
    .then(() => startShell('./scripts/installNpmPackages.sh'))
    .then(initChainCode)
    .catch(() => process.exit(1));
