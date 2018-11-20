const path = require('path');
const merge = require('merge');
const {spawn} = require('child_process');

module.exports.command = 'setup-docker-images';
module.exports.describe = 'Setup the (1.1.0) docker images for the default dev network';

// use separate version for couchdb because the version for couchDB isn't always in sync with the HF version.
module.exports.builder = {
    'hf-version': {
        'alias': 'hfv',
        'type': 'string',
        'describe': 'The version of Hyperledger Fabric to use',
        'default': '1.1.0'
    },
    'cdb-version': {
        'alias': 'cv',
        'type': 'string',
        'describe': 'The version of Hyperledger Fabric CouchDB to use',
        'default': '0.4.14'
    }
};

module.exports.handler = function(argv) {
    console.log(`executing setup-docker-images for version ${argv['hf-version']}`);

    return new Promise((fulfill, reject) => {
        const setupDockerImages = spawn('sh', [path.resolve(__dirname, '../scripts/setupDockerImages.sh')], {
            env: merge(process.env, {
                'HF_VERSION': argv['hf-version'],
                'CDB_VERSION': argv['cdb-version']
            })
        });

        setupDockerImages.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        setupDockerImages.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);

            reject(new Error(`setup docker images error ${data}`));
        });

        setupDockerImages.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Exitted with code ${code}`));
            } else {
                fulfill();
            }
        });
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
};
