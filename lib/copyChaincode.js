const fs = require('fs-extra');
const path = require('path');
const getChaincodeName = require('./utils/getChaincodeName');
const glob = require("glob");

module.exports = function copyChaincode(chaincodeLocation, chaincodeDestination, copyGlobPattern) {
    const chaincodeName = getChaincodeName(chaincodeLocation);

    const targetDir = path.join(chaincodeDestination, chaincodeName);

    console.log(`Creating directory ${targetDir}`);
    fs.ensureDirSync(targetDir);

    // Remove all files before copying, expect the node_modules
    fs.readdirSync(targetDir).forEach((file) => {
        if (file.indexOf('node_modules') !== 0) {
            const filePath = path.join(targetDir, file);
            console.log(`Removing ${filePath}`);
            fs.removeSync(filePath);
        }
    });

    console.log(`Copying chaincode to directory ${targetDir}`);

    return new Promise((resolve, reject) => {
        const globPattern = `${chaincodeLocation}/${copyGlobPattern || '**/*'}`;
        console.log('Copying files which match following pattern', globPattern);

        // options is optional
        glob(globPattern, (err, files) => {
            if (err) {
                console.log('Failed to copy chaincode files', err);
                reject(err);
                return;
            }

            const copyPromises = [];
            files.forEach((file) => {
                copyPromises.push(new Promise((copyResolve, copyReject) => {
                    const targetFilePath = path.join(targetDir, path.relative(chaincodeLocation, file));
                    fs.ensureDir(path.dirname(targetFilePath), (err) => {
                        if (err) {
                            copyReject(err);
                            return;
                        }
                        fs.copyFile(
                            file,
                            targetFilePath,
                            (err) => {
                                if (err) {
                                    copyReject(err);
                                    return;
                                }
                                copyResolve();
                            });
                    });
                }));
            });

            Promise.all(copyPromises).then(() => {
                console.log(`Copied ${files.length} files`);
                // Docker volumes sometimes are not in sync directly
                // Therefore a timeout of 5s is added here
                setTimeout(resolve, 5000);
            }).catch((err) => {
                reject(err);
            });
        });
    });
};
