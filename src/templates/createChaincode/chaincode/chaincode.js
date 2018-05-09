const shim = require('fabric-shim');
const {ChaincodeBase, ChaincodeError} = require('@kunstmaan/hyperledger-fabric-node-chaincode-utils');

const ERRORS = require('./common/constants/errors');
const CONSTANTS = require('./common/constants/index');

const YOUR_CHAINCODE_NAME_PASCAL_CASEDChaincode = class extends ChaincodeBase {
    constructor() {
        super(shim);
    }
};

shim.start(new YOUR_CHAINCODE_NAME_PASCAL_CASEDChaincode());
