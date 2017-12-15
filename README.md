# Hyperledger Fabric dev setup for chaincode development

This repo contains out of a setup which makes it easy to develop node.js chaincode.

**Only node.js chaincode is supported, go is not implemented yet. Feel free to help out and create a pull request.**

For more info on developing chaincode please have a look at the [online tutorial](http://hyperledger-fabric.readthedocs.io/en/v1.1.0-preview/chaincode4ade.html).

## Before you start

Make sure you have done the following things:

1. Use at least version 1.1.0-preview for the docker images. If not run './setupDockerImages.sh' which you can find in the root of this project.
2. Add the path of the repo to the docker file sharing preferences
3. Run `npm install`

## Starting the script

Spin up your dev environment by running `npm start -- --chaincodeLocation=./example-chaincode/fabcar1 --chaincodeLocation=./example-chaincode/fabcar2`.

You can replace the `chaincodeLocation` argument value with the path of the chaincode you wish to run.
When running from many locations you can specifiy this argument multiple times using different values.

## Node.js api

You can also install this as an npm module in your project and run it within a node.js script.

```javascript
const setupDevEnv = require('hyperledger-fabric-chaincode-dev-setup');

setupDevEnv({
    chaincodeLocations: [
        '/absolute/path/to/chaincode1',
        '/absolute/path/to/chaincode2'
    ],
    logOutputToConsole: (script, message) => {
        // 'script' return the full path to the script being executed
        // 'message' is the message which  would be written to the console
        // return false in case it should not be written to the console
        return true;
    },
    watchMode: false,
    dockerFile: './chaincode-docker-devmode/docker-compose-simple.yaml',
    chaincodeDestination: './chaincode',
    copyGlobPattern: '**/*'
}).then(() => {
    console.log('Dev env started.');
}).catch(() => {
    process.exit(1);
});
```

| Option               | Info                                                                                                           | Type                                           | Required                               |
|----------------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------|----------------------------------------|
| chaincodeLocations   | Paths to the chain code directories.                                                                           | `Array<string>`                                | Yes                                    |
| logOutputToConsole   | Called when a shell script writes something to the console                                                     | `(script: string, message: string) => boolean` | No, filters debug messages by default  |
| watchMode            | Watch files for changes, auto update chaincode when a file changes.                                            | `boolean`                                      | No, by default the user can update chaincode using the prompt window |
| dockerFile           | Location of the docker compose file for the network                                                            | `string`                                       | No, defaults to `chaincode-docker-devmode/docker-compose-simple.yaml` |
| chaincodeDestination | Destination path for the chaincode. Make sure your docker containers use the same path when using this option. | `string`                                       | No, defaults to `chaincode`            |
| copyGlobPattern      | Overwrite the glob pattern used to copy files from the chaincode location to the destination.                  | `string`                                       | No, defaults to `**/*`                 |


### Watch mode

When this option is enabled the script will watch your chaincode directory for any changes. When a change happens the chaincode will deploy a newer version of the chaincode.

**Changes to package.json will not be picked up, if you add a dependency you will need to restart the entire script.**

## What is the script doing

It automates the steps inside the [tutorial](http://hyperledger-fabric.readthedocs.io/en/v1.1.0-preview/chaincode4ade.html). 
No need to setup many terminal windows. With this repo you'll only need to run a single script. It also watches for changes in the chaincode and automatically deploys them.

Steps which are done behind the scenes:

1. Setup a simple blockchain network
2. Install npm packages needed for the chaincode script
3. Build/deploy and instantiate the chaincode
4. Start watching the chaincode for changes, when a change happens an upgrade of the chaincode is done

## Backlog

1. Watch support for package.json 
2. Only copy changed files inside watch
3. Fake `fabric-shim` to support local debugging / local database (eg using json on the file system)
4. Go language support
5. Live adding of new chaincodes
6. Document structure of a chaincode package.json file (name and hf-dev-channel)
7. Improve performance by not recreating the docker images (detect the latest version of chaincode using peer chaincode list --installed), use a separate function to start from a clean setup
