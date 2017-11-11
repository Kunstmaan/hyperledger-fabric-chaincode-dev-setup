#!/bin/bash
docker rm -f $(docker ps -aq)
docker network prune -f
docker-compose -f ./chaincode-docker-devmode/docker-compose-simple.yaml up