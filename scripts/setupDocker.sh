#!/bin/bash
docker rm -f couchdb cli chaincode peer orderer
docker network rm chaincodedockerdevmode_default
docker-compose -f ./chaincode-docker-devmode/docker-compose-simple.yaml up