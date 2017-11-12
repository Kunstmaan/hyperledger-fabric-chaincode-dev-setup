#!/bin/bash
docker exec -i cli bash -c "peer chaincode install -p chaincode/${CHAINCODE_DIR} -n mycc${VERSION} -v 0 -l node"
docker exec -i cli bash -c "peer chaincode instantiate -n mycc${VERSION} -v 0 -c '{\"Args\":[]}' -C myc -l node"