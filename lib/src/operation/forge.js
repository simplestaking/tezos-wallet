"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const rpc_1 = require("../rpc");
const utils = __importStar(require("../utils"));
const helpers_1 = require("../helpers");
/**
 * Forge operation in blocchain
 */
exports.forgeOperation = () => (source) => source.pipe(
// get head and counter
helpers_1.head(), 
// @TODO: do we need special counter here?
// get contract counter
helpers_1.counter(), 
// get contract managerKey
helpers_1.managerKey(), exports.forgeOperationAtomic(), 
// add signature to state 
// 
// TODO: move and just keep signOperation and create logic inside utils 
// tap(state => console.log('[operation]', state.walletType, state)),
operators_1.flatMap(state => {
    if (state.wallet.type === utils.WalletType.TREZOR_T) {
        return utils.signOperationTrezor(state);
    }
    else {
        return utils.signOperation(state);
    }
}));
exports.forgeOperationAtomic = () => (source) => source.pipe(
// create operation
rpc_1.rpc(state => ({
    url: '/chains/' + state.head.chain_id + '/blocks/' + state.head.hash + '/helpers/forge/operations',
    path: 'operation',
    payload: {
        branch: state.head.hash,
        contents: state.operations
    }
})));
//# sourceMappingURL=forge.js.map