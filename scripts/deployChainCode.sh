#!/bin/bash
docker exec -i chaincode bash -c "CORE_CHAINCODE_ID_NAME=mycc:${VERSION} node ${CHAINCODE_DIR}/${CHAINCODE_JS} --peer.address=peer:7052"