#!/bin/bash

# Exit on first error
set -e

docker pull hyperledger/fabric-orderer:x86_64-1.1.0-preview
docker tag hyperledger/fabric-orderer:x86_64-1.1.0-preview hyperledger/fabric-orderer:latest

docker pull hyperledger/fabric-couchdb:x86_64-1.1.0-preview
docker tag hyperledger/fabric-couchdb:x86_64-1.1.0-preview hyperledger/fabric-couchdb:latest

docker pull hyperledger/fabric-peer:x86_64-1.1.0-preview
docker tag hyperledger/fabric-peer:x86_64-1.1.0-preview hyperledger/fabric-peer:latest

docker pull hyperledger/fabric-ca:x86_64-1.1.0-preview
docker tag hyperledger/fabric-ca:x86_64-1.1.0-preview hyperledger/fabric-ca:latest

docker pull hyperledger/fabric-tools:x86_64-1.1.0-preview
docker tag hyperledger/fabric-tools:x86_64-1.1.0-preview hyperledger/fabric-tools:latest

docker pull hyperledger/fabric-ccenv:x86_64-1.1.0-preview
docker tag hyperledger/fabric-ccenv:x86_64-1.1.0-preview hyperledger/fabric-ccenv:latest

docker pull yeasy/hyperledger-fabric-couchdb