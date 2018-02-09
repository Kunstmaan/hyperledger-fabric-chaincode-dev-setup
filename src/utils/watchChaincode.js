const chokidar = require('chokidar');
const path = require('path');

const copyChaincode = require('./copyChaincode');
const upgradeChaincode = require('./upgradeChaincode');

module.exports = function watchChaincode(chaincodeLocations, chaincodeDestination) {
    // start watching

    // Upgrade chaincode whenever source files change
    chaincodeLocations.forEach((location) => {
        // Chain the upgrade promises here ... else the chaincode becomes
        // corrupt when quickly changing the same chaincode twice and it tries to upgrade
        // 2 times asynchronously
        let upgradePromise = Promise.resolve();
        let previousUpgradeTimeout = null;

        let version = 0;
        chokidar.watch([path.join(location, '**/*.js'), `!${path.join(location, 'node_modules/**')}`], {ignoreInitial: true}).on('all', () => {
            // Debounce upgrades when updates are done to the same chaincode to quick
            if (previousUpgradeTimeout != null) {
                clearTimeout(previousUpgradeTimeout);
            }

            previousUpgradeTimeout = setTimeout(() => {
                previousUpgradeTimeout = null;

                upgradePromise = upgradePromise.then(() => {
                    // Increase version number
                    version += 1;

                    console.log(`Upgrading chaincode for ${location} to version ${version}`);
                    // TODO: only copy changed file
                    return copyChaincode(location, chaincodeDestination)
                        .then(() => {
                            return upgradeChaincode(location, version).then(() => console.log(`Chaincode for ${location} upgraded successful to version ${version}`));
                        })
                        .catch((err) => {
                            console.log(`Chaincode upgrade for ${location} to version ${version} failed`);
                            console.log(err);

                            return Promise.resolve();
                        });
                });
            }, 1000);
        });
    });
};
