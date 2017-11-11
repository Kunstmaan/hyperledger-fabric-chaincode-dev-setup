#!/bin/bash
docker exec -i chaincode bash -c "CORE_CHAINCODE_ID_NAME=mycc${VERSION}:0 node ${CHAINCODE_DIR}/node/chaincode.js --peer.address=peer:7052"