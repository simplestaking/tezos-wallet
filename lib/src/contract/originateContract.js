"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const operation_1 = require("../operation");
const getContractCounter_1 = require("./getContractCounter");
const getContractManagerKey_1 = require("./getContractManagerKey");
/**
 * Originate smart contract from implicit wallet. Contract will be used for delegation.
 * Complete operations stack
 *
 * @param selector derives origination data from state
 *
 * @operation reveal for non revealed wallet
 * @operation origination
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * originateContract(state => ({
 *  fee: "100"
 *  amount: "5"
 *  to: "some address"
 * }))
 *
 */
exports.originateContract = (selector) => (source) => source.pipe(
// get meta data for contract
operators_1.map(state => (Object.assign({}, state, { originateContract: selector(state) }))), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] originate : from "' + state.wallet.publicKeyHash);
}), 
// get contract counter
getContractCounter_1.counter(), 
// get contract managerKey
getContractManagerKey_1.managerKey(), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    // revealed wallet already has a manager
    if (state.manager_key.key === undefined) {
        if (typeof state.wallet.publicKey === 'undefined') {
            console.warn('[originateContract] Public key not available in wallet. Using empty string.');
        }
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey || '',
            source: state.wallet.publicKeyHash,
            fee: common_1.parseAmount(state.originateContract.fee).toString(),
            gas_limit: "10100",
            storage_limit: "277",
            counter: (++state.counter).toString(),
        });
    }
    const originationOperation = {
        kind: "origination",
        source: state.wallet.publicKeyHash,
        fee: common_1.parseAmount(state.originateContract.fee).toString(),
        balance: common_1.parseAmount(state.originateContract.amount).toString(),
        gas_limit: "10100",
        storage_limit: "277",
        counter: (++state.counter).toString(),
        spendable: true,
        delegatable: true,
        delegate: state.originateContract.to,
        [state.wallet.node.name === "main" ? "managerPubkey" : "manager_pubkey"]: state.manager_key.manager
    };
    operations.push(originationOperation);
    return Object.assign({}, state, { operations: operations });
}), 
// create operation 
operation_1.operation());
//# sourceMappingURL=originateContract.js.map