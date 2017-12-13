const prompt = require('prompt');
const path = require('path');
const chalk = require('chalk');
const copyChaincode = require('./copyChaincode');
const upgradeChaincode = require('./upgradeChaincode');

const versions = {};

module.exports = function promptForUpgrade(
  chaincodeLocations,
  chaincodeDestination
) {
  function getVersion(location) {
    let version =
      typeof versions[location] === 'number' ? versions[location] : 0;
    version += 1;
    versions[location] = version;
    return version;
  }

  function upgrade(location, version) {
    return copyChaincode(location, chaincodeDestination)
      .then(() => {
        return upgradeChaincode(location, version).then(() => {
          console.log(
            chalk.green(
              `Chaincode for ${location} upgraded successful to version ${version}`
            )
          );
        });
      })
      .catch(err => {
        console.log(
          chalk.red(
            `Chaincode upgrade for ${location} to version ${version} failed`
          )
        );
        console.log(err);
      });
  }

  function upgradeAll(locationsToUpgrade) {
    return Promise.all(
      locationsToUpgrade.map(location => {
        return upgrade(location, getVersion(location));
      })
    );
  }

  function showPrompt() {
    const schema = {
      properties: {
        chaincode: {
          description: chalk.blue(
            `\nChaincode name:\n(0) - All\n${chaincodeLocations
              .map((location, index) => {
                return `(${(index += 1)}) - ${location}`;
              })
              .join('\n')}\n`
          ),
          type: 'number',
          required: true
        }
      }
    };

    prompt.start();

    prompt.get(schema, (err, result) => {
      if (err || typeof result.chaincode !== 'number') {
        console.log(
          chalk.red(
            `Invalid input: ${err ? err.message : JSON.stringify(result)}`
          )
        );
        return;
      }
      const { chaincode } = result;

      const locationsToUpgrade = [];

      if (chaincode === 0) {
        locationsToUpgrade.push(...chaincodeLocations);
      } else if (chaincodeLocations[chaincode - 1]) {
        locationsToUpgrade.push(chaincodeLocations[chaincode - 1]);
      }

      if (locationsToUpgrade.length === 0) {
        console.log(chalk.red(`No chaincode with number ${chaincode}`));
        setTimeout(showPrompt, 0);
      } else {
        upgradeAll(locationsToUpgrade).then(() => {
          setTimeout(showPrompt, 0);
        });
      }
    });
  }

  showPrompt();
};
