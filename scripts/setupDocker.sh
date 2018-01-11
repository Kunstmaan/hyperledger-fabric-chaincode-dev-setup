#!/bin/bash
docker rm -f couchdb cli chaincode peer orderer
docker network rm hyperledgerNet
docker network create --driver bridge --subnet=192.168.100.0/24 hyperledgerNet
docker-compose -f ./chaincode-docker-devmode/docker-compose-simple.yaml up
