#!/bin/bash
docker exec -i chaincode bash -c "CORE_CHAINCODE_ID_NAME=${CHAINCODE_NAME}:${VERSION} node ${CHAINCODE_NAME}/${CHAINCODE_JS} --peer.address=peer:7052"