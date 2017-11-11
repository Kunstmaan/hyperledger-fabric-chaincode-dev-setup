#!/bin/bash
docker exec -i chaincode bash -c "cd ${CHAINCODE_DIR}/node; npm install;"