#!/bin/bash
docker exec -i chaincode bash -c "while ! test -f \"${CHAINCODE_NAME}/package.json\"; do echo waiting for package.json; sleep 1; done; cd ${CHAINCODE_NAME}; npm install;"
