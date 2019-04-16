const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const CONSTANTS = require('../constants');

const buildCommon = function buildCommon(chaincodes, sourcePath, buildPath) {
    const commonPath = path.join(sourcePath, 'common/package.json');

    if (!fs.existsSync(commonPath)) {
        return Promise.resolve();
    }

    const commonDependencies = require(commonPath).dependencies || {};

    return Promise.all(chaincodes.map((chaincode) => {

        return fs.copy(path.resolve(sourcePath, 'common'), path.resolve(buildPath, chaincode, 'common'), {
            'overwrite': true,
            'filter': (src) => {

                return [
                    /^.+(\/node_modules).*$/i,
                    /^.+(\/package.json).*$/i,
                    /^.+(\/package-lock.json).*$/i
                ].findIndex((regex) => {

                    return regex.test(src);
                }) === -1;
            }
        }).then(() => {
            const chaincodeJsonPath = path.resolve(buildPath, chaincode, 'package.json');
            const chaincodePackage = require(chaincodeJsonPath);

            chaincodePackage.dependencies = _.defaults(chaincodePackage.dependencies || {}, commonDependencies);

            return fs.writeFile(chaincodeJsonPath, JSON.stringify(chaincodePackage, null, 4), {
                encoding: 'utf8'
            });
        });
    }));
};

const buildChaincode = function buildChaincode(chaincodeFolderName, sourcePath, buildPath, filePath) {
    if (filePath != null) {

        return fs.copy(path.resolve(sourcePath, CONSTANTS.CHAINCODES_DIR_NAME, chaincodeFolderName, filePath), path.resolve(buildPath, chaincodeFolderName, filePath), {
            'overwrite': true
        });
    }

    return fs.copy(path.resolve(sourcePath, CONSTANTS.CHAINCODES_DIR_NAME, chaincodeFolderName), path.resolve(buildPath, chaincodeFolderName), {
        'overwrite': true,
        'filter': (src) => {

            return [
                /^.+(\/common)$/i,
                /^.+(\/node_modules).*$/i,
                /^.+(\/playground.js).*$/i,
                /^.+(\/package-lock.json).*$/i
            ].findIndex((regex) => {

                return regex.test(src);
            }) === -1;
        }
    });
};

const build = (sourcePath, buildPath, chaincodes) => {

    return fs.remove(buildPath)
        .then(() => {

            return fs.mkdir(buildPath);
        }).then(() => {

            return Promise.all(chaincodes.map((chaincode) => {

                return buildChaincode(chaincode, sourcePath, buildPath);
            })).then(() => {

                return buildCommon(chaincodes, sourcePath, buildPath);
            });
        });
};

module.exports = {
    buildCommon,
    buildChaincode,
    build
};
