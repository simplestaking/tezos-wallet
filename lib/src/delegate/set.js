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
const utils = __importStar(require("../utils"));
const helpers_1 = require("../helpers");
const operation_1 = require("../operation");
/**
 *  Set delegation rights to tezos address
 */
exports.setDelegation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { setDelegate: selector(state) }))), 
// get contract counter
helpers_1.counter(), 
// get contract managerKey
helpers_1.managerKey(), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] setDelegate: from "' + state.wallet.publicKeyHash + '" to "' + state.setDelegate.to + '"');
}), operators_1.tap(state => {
    console.log('[+] wallet: from "' + state.wallet);
}), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey,
            source: state.wallet.publicKeyHash,
            fee: utils.parseAmount(state.setDelegate.fee).toString(),
            gas_limit: "10100",
            storage_limit: "277",
            counter: (++state.counter).toString(),
        });
    }
    operations.push({
        kind: "delegation",
        source: state.wallet.publicKeyHash,
        fee: utils.parseAmount(state.setDelegate.fee).toString(),
        gas_limit: "10100",
        storage_limit: "277",
        counter: (++state.counter).toString(),
        delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    });
    return Object.assign({}, state, { operations: operations });
}), 
// create operation 
operation_1.operation());
//# sourceMappingURL=set.js.map