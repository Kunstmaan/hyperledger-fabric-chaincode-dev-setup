#!/bin/bash
docker exec -i chaincode bash -c "cd ${CHAINCODE_NAME};  IS_DEV_ENVIRONMENT=true CORE_CHAINCODE_ID_NAME=${CHAINCODE_NAME}:${VERSION} npm start -- --peer.address=${PEER_NAME}:7052"
