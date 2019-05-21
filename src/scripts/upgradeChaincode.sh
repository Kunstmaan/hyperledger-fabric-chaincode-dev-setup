#!/bin/bash
docker exec -i cli bash -c "peer chaincode install -p chaincode/${CHAINCODE_NAME} -n ${CHAINCODE_NAME} -v ${VERSION} -l node"

if [ "${HAS_COLLECTIONS_CONFIG}" = true ]; then
    docker exec -i cli bash -c "peer chaincode upgrade -n ${CHAINCODE_NAME} -v ${VERSION} -c '{\"Args\":${INSTANTIATE_ARGS}}' --channelID ${CHAINCODE_CHANNEL} --collections-config chaincode/${CHAINCODE_NAME}/collections_config.json -l node"
else
    docker exec -i cli bash -c "peer chaincode upgrade -n ${CHAINCODE_NAME} -v ${VERSION} -c '{\"Args\":${INSTANTIATE_ARGS}}' --channelID ${CHAINCODE_CHANNEL}  -l node"
fi
