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

By default the script will watch your chaincode directory for any changes. When a change happens the chaincode will be updated on the docker container.

**Changes to package.json will not work, if you add a dependency you will need to restart the entire script.**

## What is the script doing

It automates the step inside the tutorial. Inside the tutorial you'll need to open many terminals to setup your dev environment. With this repo you'll only need to run a single script.

Steps which are done behind the scenes:

1. Setup a simple blockchain network
2. Build/deploy and instantiate the chaincode
3. Start a terminal

Also on every change inside a chaincode js file it will perform step 2 and 3 again. This makes it easier as you can just keep editing your code and don't need to manually run these steps again on every change.

As it's not possible to deploy the same chaincode twice a number is included inside the name. This number is bumped on every change.

## Backlog

1. Go language support
2. Support many chaincode directories / chaincode invoking other chain code
