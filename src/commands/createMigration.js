const path = require('path');
const fs = require('fs-extra');
const formatDate = require('date-format');
const locateConfig = require('../utils/locateConfig');

const CONSTANTS = require('../constants');

module.exports.command = 'create-migration <chaincode>';
module.exports.describe = 'Create new migration file';

module.exports.handler = function(argv) {
    console.log('executing create-migration');

    return locateConfig('./').then(({configPath, configContents}) => {
        const chaincodePath = path.resolve(path.dirname(configPath), configContents[CONSTANTS.CONFIG_SOURCE_PATH_KEY], 'chaincodes', argv.chaincode);

        return fs.stat(path.join(chaincodePath, 'package.json')).then((stats) => {
            if (!stats.isFile()) {

                throw new Error(`No package.json file found inside ${chaincodePath}`);
            }

            if (!chaincodePath) {

                throw new Error(`No chaincode found with name ${argv.chaincode}`);
            }

            const migrationDirectory = `${chaincodePath}/migrations`;
            fs.ensureDirSync(migrationDirectory);

            console.log(`Adding migration for chaincode ${argv.chaincode} inside directory ${migrationDirectory}`);

            // Create migration file
            const fileName = `Version-${formatDate.asString('yyyyMMddhhmmss', new Date())}.js`;
            const migrationFilePath = path.join(migrationDirectory, fileName);

            return fs.copy(path.join(__dirname, '../templates/createMigration/migration.js'), migrationFilePath).then(() => {
                console.log(`Created migration file for chaincode ${argv.chaincode} with path ${migrationFilePath}`);
            });
        });

    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
