const {setTimeout} = require('timers');
const path  = require('path');
const {spawn} = require('child_process');

module.exports = function startShell(
    script, 
    envVariables = {},
    timeout = undefined, 
    outputToConsole = true
) {
    return new Promise((resolve, reject) => {
        const ls = spawn('sh', [script], {
            cwd: path.join(__dirname, '../../'),
            env: envVariables
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
