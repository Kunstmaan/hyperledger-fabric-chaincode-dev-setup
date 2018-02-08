#!/bin/bash
docker rm -f couchdb cli chaincode peer orderer
if ! docker network ls | grep -q hyperledgerNet; then
    docker network create --driver bridge --subnet=192.168.100.0/24 hyperledgerNet
fi
docker-compose -f ${HF_DOCKER_FILE} up