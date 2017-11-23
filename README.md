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
    ]
});
```

There is also an option to control which output gets written to the console.
By default all debug related messages will not be outputted to the console.

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
    }
});
```

## Watch mode

By default the script will watch your chaincode directory for any changes. When a change happens the chaincode will deploy a newer version of the chaincode.

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
