#!/bin/bash

# Exit on first error
set -e

which docker

if [ $? -eq 0 ]; then
    echo "Installing Hyperledger Fabric ${HF_VERSION} and CouchDB ${CDB_VERSION}"

    docker pull hyperledger/fabric-orderer:${HF_VERSION}
    docker tag hyperledger/fabric-orderer:${HF_VERSION} hyperledger/fabric-orderer:latest

    docker pull hyperledger/fabric-couchdb:${CDB_VERSION}
    docker tag hyperledger/fabric-couchdb:${CDB_VERSION} hyperledger/fabric-couchdb:latest

    docker pull hyperledger/fabric-peer:${HF_VERSION}
    docker tag hyperledger/fabric-peer:${HF_VERSION} hyperledger/fabric-peer:latest

    docker pull hyperledger/fabric-ca:${HF_VERSION}
    docker tag hyperledger/fabric-ca:${HF_VERSION} hyperledger/fabric-ca:latest

    docker pull hyperledger/fabric-tools:${HF_VERSION}
    docker tag hyperledger/fabric-tools:${HF_VERSION} hyperledger/fabric-tools:latest

    docker pull hyperledger/fabric-ccenv:${HF_VERSION}
    docker tag hyperledger/fabric-ccenv:${HF_VERSION} hyperledger/fabric-ccenv:latest

    docker pull yeasy/hyperledger-fabric-couchdb

else
    echo "docker not installed"
fi
