"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const contract_1 = require("../contract");
const operation_1 = require("../operation");
/**
 *  Set delegation rights to tezos address
 *
 * @param selector provides data for delegation operation
 *
 * @operation reveal when wallet was not revealed yet
 * @operation delegation
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * setDelegate(state => ({
 *  fee: string
 *  to: string
 * }))
 *
 */
exports.setDelegation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { setDelegate: selector(state) }))), 
// get contract counter
contract_1.counter(), 
// get contract managerKey
contract_1.managerKey(), 
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
        if (typeof state.wallet.publicKey === 'undefined') {
            console.warn('[setDelegation] Public key not available in wallet. Using empty string.');
        }
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey || '',
            source: state.wallet.publicKeyHash,
            fee: common_1.parseAmount(state.setDelegate.fee).toString(),
            gas_limit: "10100",
            storage_limit: "277",
            counter: (++state.counter).toString(),
        });
    }
    operations.push({
        kind: "delegation",
        source: state.wallet.publicKeyHash,
        fee: common_1.parseAmount(state.setDelegate.fee).toString(),
        gas_limit: "10100",
        storage_limit: "277",
        counter: (++state.counter).toString(),
        delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    });
    return Object.assign({}, state, { operations: operations });
}), 
// create operation 
operation_1.operation());
