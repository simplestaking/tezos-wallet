"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const operation_1 = require("../operation");
/**
  * Activate wallet
  */
exports.activateWallet = (fn) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { activateWallet: fn(state) }))), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    operations.push({
        kind: "activate_account",
        pkh: state.wallet.publicKeyHash,
        secret: state.activateWallet.secret
    });
    return Object.assign({}, state, { operations: operations });
}), 
// create operation 
operation_1.operation());
