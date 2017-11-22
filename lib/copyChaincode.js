const fs = require('fs-extra');
const path = require('path');
const getChaincodeName = require('./utils/getChaincodeName');

module.exports = function copyChaincode(chaincodeLocation, chaincodeDestination) {
    const chaincodeName = getChaincodeName(chaincodeLocation);

    const targetDir = path.join(chaincodeDestination, chaincodeName);
    console.log(`Creating directory ${targetDir}`);
    fs.ensureDirSync(targetDir);
    console.log(`Copying chaincode to directory ${targetDir}`);

    return new Promise((resolve, reject) => {
        fs.copy(chaincodeLocation, targetDir, (err) => {
            if (err) {
                console.log('Failed to copy chaincode files', err);
                reject(err);
                return;
            }
            // Docker volumes sometimes are not in sync directly
            // Therefore a timeout of 1s is added here
            setTimeout(resolve, 1000);
        });
    });
};
