"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const head_1 = require("../head");
// prevent circular dependency
const getContractCounter_1 = require("../contract/getContractCounter");
const getContractManagerKey_1 = require("../contract/getContractManagerKey");
const signOperation_1 = require("./signOperation");
/**
 * Forge operation in blocchain.
 * Converts operation into binary format and signs operation using script or Trezor
 *
 *
 */
exports.forgeOperation = () => (source) => source.pipe(
// get head and counter
head_1.head(), 
// get contract counter
getContractCounter_1.counter(), 
// get contract managerKey
getContractManagerKey_1.managerKey(), forgeOperationAtomic(), 
// add signature to state     
operators_1.flatMap(state => {
    if (state.wallet.type === 'TREZOR_T') {
        return signOperation_1.signOperationTrezor(state);
    }
    else {
        return signOperation_1.signOperation(state);
    }
}));
/**
 * Converts operation to binary format on node
 *
 * @url /chains/[chainId]/blocks/[headHash]/helpers/forge/operations
 */
const forgeOperationAtomic = () => (source) => source.pipe(
// create operation
common_1.rpc(state => ({
    url: `/chains/${state.head.chain_id}/blocks/${state.head.hash}/helpers/forge/operations`,
    path: 'operation',
    payload: {
        branch: state.head.hash,
        contents: state.operations
    }
})));
