const {spawn} = require('child_process');
const path = require('path');
const chokidar = require('chokidar');
const fs = require('fs');
const terminalTab = require('./scripts/utils/terminal-tab');

const DEFAULT_CHAINCODE_PATH = './example-chaincode/fabcar/';

let buildIteration = 0;

const chaincodeLocation = process.env.CHAINCODE_LOCATION || path.resolve(__dirname, DEFAULT_CHAINCODE_PATH);

const stat = fs.statSync(chaincodeLocation);
if (!stat.isDirectory()) {
    throw new Error(`Invalid chain code location.`, chaincodeLocation);
}

console.log(`Running chaincode for directory: ${chaincodeLocation}`);

const startShell = (script) => {
    const ls = spawn('sh', [script], {
        cwd: __dirname,
        env: {
            'VERSION': buildIteration,
            'CHAINCODE_DIR': 'fabcar'
        }
    });

    ls.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    ls.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

const openTerminal = () => {
    terminalTab.open(
        'echo -e You can now start executing chaincode;' +
        `echo See ${__dirname}/scripts/executeChainCode.sh for examples;` +
        `docker exec -it -e VERSION=${buildIteration} cli bash;`
    )
}

const initChainCode = () => {
    // Deploy chain code
    startShell('./scripts/deployChainCode.sh');

    setTimeout(() => {
        // Init chain code
        startShell('./scripts/initChainCode.sh');
        setTimeout(() => {
            // Open terminal to execute chain code
            openTerminal();
        }, 5000);
    }, 5000);
};

// Update chaincode whenever source files change
chokidar.watch(path.join(chaincodeLocation, '**/node/*.js'), {ignoreInitial: true})
    .on('all', (event, path) => {
        console.log(event, path);
        buildIteration += 1;
        initChainCode();
    });

// Start docker
startShell('./scripts/setupDocker.sh');

// Wait for the docker containers to be running
setTimeout(initChainCode, 30000);
