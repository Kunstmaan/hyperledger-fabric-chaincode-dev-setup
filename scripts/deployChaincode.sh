#!/bin/bash
docker exec -i chaincode bash -c "cd ${CHAINCODE_NAME}; CORE_CHAINCODE_ID_NAME=${CHAINCODE_NAME}:${VERSION} npm start -- --peer.address=peer:7052"