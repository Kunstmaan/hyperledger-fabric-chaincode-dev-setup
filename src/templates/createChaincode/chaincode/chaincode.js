const shim = require('fabric-shim');
const ChaincodeBase = require('./common/ChaincodeBase');
const ChaincodeError = require('./common/ChaincodeError');

const ERRORS = require('./common/constants/errors');
const CONSTANTS = require('./common/constants/index');

let Chaincode = class extends ChaincodeBase {

};

shim.start(new Chaincode());
