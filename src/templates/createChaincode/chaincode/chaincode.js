const shim = require('fabric-shim');
const {ChaincodeBase, ChaincodeError} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils'); // eslint-disable-line

const ERRORS = require('./common/constants/errors');
const CONSTANTS = require('./common/constants/index');

const YOUR_CHAINCODE_NAME_PASCAL_CASEDChaincode = class extends ChaincodeBase {

};

shim.start(new YOUR_CHAINCODE_NAME_PASCAL_CASEDChaincode());
