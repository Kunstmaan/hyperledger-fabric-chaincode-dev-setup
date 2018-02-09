const _ = require('lodash');
const fs = require('fs-extra');
const {spawn} = require('child_process');
const path = require('path');
const fileExistsWithMode = require('../utils/fileExistsWithMode');

const CONSTANTS = require('../constants');

module.exports.command = 'init <path>';
module.exports.describe = 'Initialize new chaincode project';

module.exports.handler = function(argv) {
    console.log('executing init');

    const cwdPath = path.resolve('./', argv.path);

    return readOrCreatePackageFile(cwdPath)
        .then(addConfiguration(cwdPath))
        .then(printContents('Saving package.json'))
        .then(savePackageFile(cwdPath))
        .then(createStructure(cwdPath))
        .then(() => {
            console.log('Done initializing!');
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
};

function createStructure(cwdPath) {

    return function(contents) {
        const sourcePath = path.resolve(cwdPath, contents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_SOURCE_PATH_KEY]);
        const commonPath = path.resolve(sourcePath, 'common');
        const testPath = path.resolve(cwdPath, contents[CONSTANTS.CONFIG_KEY][CONSTANTS.CONFIG_TEST_PATH_KEY]);

        return Promise.all([
            fs.ensureDir(testPath),
            fs.ensureDir(sourcePath).then(() => {

                return Promise.all([
                    fs.ensureDir(path.resolve(sourcePath, CONSTANTS.CHAINCODES_DIR_NAME)),
                    fs.ensureDir(commonPath).then(() => {

                        return fileExistsWithMode(path.resolve(commonPath, 'package.json'), fs.constants.R_OK)
                            .then((existsAndReadable) => {
                                if (!existsAndReadable) {

                                    return fs.copy(
                                        path.resolve(__dirname, '../templates/init/commonPackage.json'),
                                        path.resolve(commonPath, 'package.json')
                                    );
                                }

                                return Promise.resolve();
                            });
                    })
                ]);
            })
        ]);
    };
}

function savePackageFile(cwdPath) {

    return function(contents) {

        return fs.writeFile(path.resolve(cwdPath, 'package.json'), JSON.stringify(contents, null, 4, {
            encoding: 'utf8'
        })).then(() => {

            return contents;
        });
    };
}

function addConfiguration() {

    return function(contents) {
        const packageContents = contents;
        packageContents[CONSTANTS.CONFIG_KEY] = _.defaults(contents[CONSTANTS.CONFIG_KEY], {
            [CONSTANTS.CONFIG_CHAINCODES_KEY]: [],
            [CONSTANTS.CONFIG_SOURCE_PATH_KEY]: './src',
            [CONSTANTS.CONFIG_BUILD_PATH_KEY]: './build',
            [CONSTANTS.CONFIG_TEST_PATH_KEY]: './test'
        });

        return packageContents;
    };
}

function readOrCreatePackageFile(cwdPath) {
    const packagePath = path.resolve(cwdPath, 'package.json');

    return fileExistsWithMode(packagePath, fs.constants.W_OK)
        .then((existsAndWritable) => {
            if (existsAndWritable) {
                console.log('package.json found, reading content.');
            } else {

                return new Promise((fulfill, reject) => {
                    console.log('No package.json found, initialize a new one.');
                    const npmInit = spawn('npm', ['init'], {
                        'cwd': cwdPath
                    });

                    npmInit.stdout.on('data', (data) => {
                        process.stdout.write(data);
                    });

                    npmInit.stderr.on('data', (data) => {
                        reject(new Error(`npm init error ${data}`));
                    });

                    const stdinStream = process.stdin.on('readable', () => {
                        const chunk = process.stdin.read();

                        if (chunk !== null) {
                            npmInit.stdin.write(chunk);
                        }
                    });

                    npmInit.on('close', () => {
                        fulfill();
                        stdinStream.end();
                    });
                });
            }

            return Promise.resolve();
        }).then(() => {

            return fs.readFile(packagePath, 'utf8').then((contents) => {

                return JSON.parse(contents);
            });
        });
}

function printContents(title) {

    return function(contents) {
        console.log(title);
        console.log(contents);

        return contents;
    };
}
