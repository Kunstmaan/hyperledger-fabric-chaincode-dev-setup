const {setTimeout} = require('timers');
const path = require('path');
const merge = require('merge');

const {spawn} = require('child_process');

/**
 * Execute a shell script
 * @param {string} script Absolute path to shell script
 * @param {object} envVariables Environment variables to pass to script
 * @param {Regex} finishedOnRegex When using this opion the promise will resolve when it finds a message matchin the pattern inside the console output
 * @param {number} maxTimeout Wait for a maximum amount of time before the script should return that it has finished
 */
module.exports = function startShell(
    script,
    envVariables = {},
    finishedOnRegex = undefined,
    maxTimeout = undefined
) {
    return new Promise((resolve, reject) => {
        let hasFinished = false;
        let timeoutId;

        const setHasFinished = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            hasFinished = true;
        };

        const checkConsoleMessage = (message) => {
            if (!hasFinished) {
                if (finishedOnRegex && finishedOnRegex.test(message)) {
                    console.log(`${script} has finished, detected regex match inside console output.`);
                    setHasFinished();
                    resolve();
                }
            }
            return false;
        };

        const ls = spawn('sh', [script], {
            cwd: path.join(__dirname, '../../'),
            env: merge(process.env, envVariables),
            shell: true,
            stdio:`inherit`
        });

        ls.stdout.on('data', (data) => {
            console.log(data.toString());
            checkConsoleMessage(data.toString());
        });

        ls.stderr.on('data', (data) => {
            console.log(data.toString());
            checkConsoleMessage(data.toString());
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
           
            if (code !== 0) {
                const errorMessage = `${script} exited with an error`;
                !hasFinished ? setHasFinished() && reject(errorMessage) : console.error(errorMessage);
            } else if (!hasFinished) {
                setHasFinished();
                resolve();
            }
        });

        if (maxTimeout) {
            timeoutId = setTimeout(() => {
                if (!hasFinished) {
                    console.log(`${script} has finished, timeout of ${maxTimeout} expired.`);
                    hasFinished = true;
                    resolve();
                }
            }, maxTimeout)
        }
    });
}
