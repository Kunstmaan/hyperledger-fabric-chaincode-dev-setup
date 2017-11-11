# Hyperledger Fabric dev tools for chaincode

This repo contains out of a setup which makes it easy to develop node.js chaincode.

**Only node.js chaincode is supported, go is not implemented yet. Feel free to help out and create a pull request.**

For more info on developing chaincode please have a look at the [online tutorial](http://hyperledger-fabric.readthedocs.io/en/v1.1.0-preview/chaincode4ade.html).

## Before you start

Make sure you have done the following things:

1. Use at least version 1.1.0-preview for the docker images. If not run './setupDockerImages.sh' which you can find in the root of this project.
2. Add the path of the repo to the docker file sharing preferences
3. Always put your chaincode inside a directory named 'node' and name your chaincode file 'chaincode.js'. The build/watch logic depends on this.
4. Run `npm install`

## Starting the script

Spin up your dev environment by running `npm start -- --chaincodeLocation=./example-chaincode/fabcar`.

You can replace the `chaincodeLocation` argument value with the path of the chaincode you wish to run.

## Watch mode

By default the script will watch your chaincode directory for any changes. When a change happens the chaincode will deploy a newer version of the chaincode.

**Changes to package.json will not be picked up, if you add a dependency you will need to restart the entire script.**

## What is the script doing

It automates the steps inside the [tutorial](http://hyperledger-fabric.readthedocs.io/en/v1.1.0-preview/chaincode4ade.html). No need to setup many terminal windows. With this repo you'll only need to run a single script. It also watches for changes in the chaincode and automatically deploys them.

Steps which are done behind the scenes:

1. Setup a simple blockchain network
2. Install npm packages needed for the chaincode script
3. Build/deploy and instantiate the chaincode
4. Start a terminal
5. Start watching the chaincode for changes, when a change happens step 3 and 4 are performed again

As it's not possible to deploy the same chaincode twice a number is included inside the chaincode name. This number is bumped on every change. This makes it possible in watch mode to only rerun a couple of the build steps which at the end makes everything faster.

## Backlog

1. Go language support
2. Support many chaincode directories / chaincode invoking other chain code
