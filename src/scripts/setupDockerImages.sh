#!/bin/bash

# Exit on first error
set -e

which docker

if [ $? -eq 0 ]
then
    echo "Installing ${HF_VERSION}"

    docker pull hyperledger/fabric-orderer:x86_64-${HF_VERSION}
    docker tag hyperledger/fabric-orderer:x86_64-${HF_VERSION} hyperledger/fabric-orderer:latest

    docker pull hyperledger/fabric-couchdb:x86_64-${HF_VERSION}
    docker tag hyperledger/fabric-couchdb:x86_64-${HF_VERSION} hyperledger/fabric-couchdb:latest

    docker pull hyperledger/fabric-peer:x86_64-${HF_VERSION}
    docker tag hyperledger/fabric-peer:x86_64-${HF_VERSION} hyperledger/fabric-peer:latest

    docker pull hyperledger/fabric-ca:x86_64-${HF_VERSION}
    docker tag hyperledger/fabric-ca:x86_64-${HF_VERSION} hyperledger/fabric-ca:latest

    docker pull hyperledger/fabric-tools:x86_64-${HF_VERSION}
    docker tag hyperledger/fabric-tools:x86_64-${HF_VERSION} hyperledger/fabric-tools:latest

    docker pull hyperledger/fabric-ccenv:x86_64-${HF_VERSION}
    docker tag hyperledger/fabric-ccenv:x86_64-${HF_VERSION} hyperledger/fabric-ccenv:latest

    docker pull yeasy/hyperledger-fabric-couchdb

else
    echo "docker not installed"
fi
