#!/bin/bash
docker exec -i cli bash -c "peer chaincode install -p chaincode/${CHAINCODE_NAME} -n ${CHAINCODE_NAME} -v ${VERSION} -l node"
docker exec -i cli bash -c "peer chaincode upgrade -n ${CHAINCODE_NAME} -v ${VERSION} -c '{\"Args\":[]}' -C ${CHAINCODE_CHANNEL} -l node"