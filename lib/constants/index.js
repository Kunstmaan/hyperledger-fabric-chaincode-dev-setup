const path = require('path');

module.exports = {
    DEFAULT_CHANNEL: 'myc',
    DEFAULT_CHAINCODE_DESTINATION_PATH: path.resolve(__dirname, '../../dev-network/generated/devmode/chaincode'),
    DEFAULT_DOCKER_FILE: path.resolve(__dirname, '../../dev-network/generated/devmode/docker-compose-simple.yaml'),
    SCRIPTS_PATH: path.resolve(__dirname, '../../scripts'),
    DOCKER_SETUP_FINISHED_REGEX: /^.*?orderer.*?\[orderer\/common\/deliver\]\s+deliverBlocks\s+->\s+DEBU\s[0-9].*?\[channel:\s+.*?\]\s+Received\s+seekInfo\s+\(.*?\)\s+start:.*?$/gmi,
    DEPLOY_FINISHED_REGEX: /^.*?Successfully\s+established\s+communication\s+with\s+peer\s+node\.\s+State\s+transferred\s+to\s+"ready".*?$/gmi
};
