const inquirer = require('inquirer');
const chalk = require('chalk');

const copyChaincode = require('./copyChaincode');
const upgradeChaincode = require('./upgradeChaincode');
const getChaincodeName = require('./getChaincodeName');

const versions = {};
// Keep track of the last value selected in the prompt
let lastPrompt;

module.exports = function promptForUpgrade(chaincodeLocations, chaincodeDestination) {
    const chaincodeNames = chaincodeLocations.map((location) => getChaincodeName(location));

    function findChaincodeByName(name) {

        return chaincodeLocations.find((location) => getChaincodeName(location) === name);
    }

    function getVersion(location) {
        let version = typeof versions[location] === 'number' ? versions[location] : 0;
        version += 1;
        versions[location] = version;

        return version;
    }

    function upgrade(location, version) {

        return copyChaincode(location, chaincodeDestination)
            .then(() => {
                return upgradeChaincode(location, version).then(() => {
                    console.log(chalk.green(`Chaincode for ${location} upgraded successful to version ${version}`));
                });
            })
            .catch((err) => {
                console.log(chalk.red(`Chaincode upgrade for ${location} to version ${version} failed`));
                console.log(err);
            });
    }

    function upgradeAll(locationsToUpgrade) {

        return Promise.all(locationsToUpgrade.map((location) => {

            return upgrade(location, getVersion(location));
        }));
    }

    function showPrompt() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'chaincodeName',
                    message: 'Select the chaincode you wish to upgrade',
                    choices: ['All', ...chaincodeNames],
                    default: lastPrompt || chaincodeNames[0] || 'All'
                }
            ])
            .then((result) => {
                if (!result || !result.chaincodeName || typeof result.chaincodeName !== 'string') {
                    console.log(chalk.red(`Invalid input: ${JSON.stringify(result)}`));
                    return;
                }
                const {chaincodeName} = result;

                lastPrompt = chaincodeName;

                const locationsToUpgrade = [];

                if (chaincodeName === 'All') {
                    locationsToUpgrade.push(...chaincodeLocations);
                } else if (findChaincodeByName(chaincodeName)) {
                    locationsToUpgrade.push(findChaincodeByName(chaincodeName));
                }

                if (locationsToUpgrade.length === 0) {
                    console.log(chalk.red(`No chaincode found with name ${chaincodeName}`));
                    setTimeout(showPrompt, 0);
                } else {
                    upgradeAll(locationsToUpgrade).then(() => {
                        setTimeout(showPrompt, 0);
                    });
                }
            })
            .catch((err) => {
                console.error(`Unhandled error inside prompt, please log an issue on GitHub: ${err.message}`);
            });
    }

    showPrompt();
};
