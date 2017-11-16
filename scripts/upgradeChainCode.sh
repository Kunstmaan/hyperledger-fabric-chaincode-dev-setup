#!/bin/bash
docker exec -i cli bash -c "peer chaincode install -p chaincode/${CHAINCODE_DIR} -n mycc -v ${VERSION} -l node"
docker exec -i cli bash -c "peer chaincode upgrade -n mycc -v ${VERSION} -c '{\"Args\":[]}' -C myc -l node"