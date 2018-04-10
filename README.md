# Hyperledger Fabric dev setup for chaincode development [![npm version](https://badge.fury.io/js/%40kunstmaan%2Fhyperledger-fabric-chaincode-dev-setup.svg)](https://badge.fury.io/js/%40kunstmaan%2Fhyperledger-fabric-chaincode-dev-setup)

This repo contains out of a setup which makes it easy to develop node.js chaincode.

**Only node.js chaincode is supported, go is not implemented yet. Feel free to help out and create a pull request.**

For more info on developing chaincode please have a look at the [online tutorial](https://hyperledger-fabric.readthedocs.io/en/release-1.1/chaincode4ade.html).

## CLI API

### Installing 

```
npm install @kunstmaan/hyperledger-fabric-chaincode-dev-setup -g
```

With the following command you can get an overview of all the commands available:

```
kuma-hf-chaincode-dev -h
```
**Dependency: this tool required Node version >= 8**

### Start dev network environment

Make sure you have at least version 1.1.0 of the docker images installed. For this you can use the following command:

``` 
kuma-hf-chaincode-dev setup-docker-images
```

Furthermore you must make sure that the 'chaincode destination directory' is accesible to docker using the docker file sharing preferences. If you didn't specify this directory you must make sure the path of the npm package itself is added to the docker file sharing preference.

#### Initialized project

When you want to start a dev network on an initialized project you can just run:

``` 
kuma-hf-chaincode-dev start-dev [optional -w]
``` 

In this case all configuration is found in the package.json.

When you want to run a dev network without using our project structure.

`-w` enables watch mode on the network.

#### Standalone mode

``` 
kuma-hf-chaincode-dev start-dev --cp ./example-chaincode/fabcar1 --cp ./example-chaincode/fabcar2 [optional -w]
```

`cp` stands for `chaincodePath` and you can replace the  argument value with the path of the chaincode you wish to run.
When running from many locations you can specifiy this argument multiple times using different values.

`-w` enables watch mode on the network.

### Initializing new Project

``` 
kuma-hf-chaincode-dev init <path>
```

Initializes a new project structure within the given path. This will create a `src/chaincodes`, `src/common` and `test` folder structure. And will add the needed configuration within the `package.json`. If no `package.json` is found it will trigger `npm init .`.

* `src/chaincodes` is the folder that will contain all the chaincodes.
* `src/common` is the folder that contains all the shared code between all the chaincodes.
* `test` will be used for all the tests 

This will also add the necesary configuration under the key `kuma-hf-chaincode-dev` to the `package.json`for the other commands to use. This configuration can be overwritten.

* `chaincodes`: the list of all the chaincodes to deploy to the network
* `sourcePath`: the path to the `src` directory 
* `buildPath`: the path to where the chaincode should be builded, the build process will integrate the common part into each chaincode
* `testPath`: the path to where the tests are
* `dockerFile`: this is configuration for setting up the dev network. By default this will use the default dockerFile integrated within this repository
* `chaincodeDestination`: the location where the chaincode should be moved so that it's mounted within the right docker container

### Create new chaincode

``` 
kuma-hf-chaincode-dev create-chaincode <chaincode> [optional -d <description>]
```

Replace `chaincode` with the name of your chaincode. `-d` is optional and can be used to specify the description for the `package.json` of the chaincode.

### Create new migration

``` 
kuma-hf-chaincode-dev create-migration <chaincode>
```

Generate a migration file for the given `chaincode`. This migration file can be used when installing our `hyperledger-fabric-node-chaincode-utils` package. 

### Build Chaincode

``` 
kuma-hf-chaincode-dev build
```

This will move the chaincodes to the `buildPath` and integrate the common part within each of them. This is useful for deploying to a real network. `start-dev` will also use this behind the scenes.

### Cleanup chaincode on dev network

``` 
kuma-hf-chaincode-dev cleanup-chaincode
``` 

This will cleanup all the chaincode that's installed on the dev network. If you run this in an initialized project it will use that configuration else it will cleanup the chaincode from the standalone version.

## Node.js API

You can also install this as an npm module in your project and run it within a node.js script.

### Installing 

```
npm install @kunstmaan/hyperledger-fabric-chaincode-dev --save
```

```javascript
const {setupDevEnv} = require('@kunstmaan/hyperledger-fabric-chaincode-dev-setup');

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
    dockerFile: './dev-network/generated/devmode/docker-compose-simple.yaml',
    chaincodeDestination: './dev-network/generated/devmode/chaincode',
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
| dockerFile           | Location of the docker compose file for the network                                                            | `string`                                       | No, defaults to `dev-network/generated/devmode/docker-compose-simple.yaml` |
| chaincodeDestination | Destination path for the chaincode. Make sure your docker containers use the same path when using this option. | `string`                                       | No, defaults to `dev-network/generated/devmode/chaincode`            |
| copyGlobPattern      | Overwrite the glob pattern used to copy files from the chaincode location to the destination.                  | `string`                                       | No, defaults to `**/*`                 |


### Watch mode

When this option is enabled the script will watch your chaincode directory for any changes. When a change happens the chaincode will deploy a newer version of the chaincode.

**Changes to package.json will not be picked up, if you add a dependency you will need to restart the entire script.**

## What is the script doing

It automates the steps inside the [tutorial](https://hyperledger-fabric.readthedocs.io/en/release-1.1/chaincode4ade.html).
No need to setup many terminal windows. With this repo you'll only need to run a single script. It also watches for changes in the chaincode and automatically deploys them.

Steps which are done behind the scenes:

1. Setup a simple blockchain network
2. Install npm packages needed for the chaincode script
3. Build/deploy and instantiate the chaincode
4. Start watching the chaincode for changes, when a change happens an upgrade of the chaincode is done

## Update the example network

The example network setup has been generated using the [hyperledger-fabric-network-setup](https://github.com/Kunstmaan/hyperledger-fabric-network-setup) scripts.

Perform following steps to regenerate it:

1. Follow the [installation steps](https://github.com/Kunstmaan/hyperledger-fabric-network-setup#install)
2. Run `cd network-setup`
2. Run `sudo kuma-hf-network generate crypto-config.yaml`
