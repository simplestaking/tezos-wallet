"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
const contract_1 = require("../contract");
const operation_1 = require("../operation");
/**
 * Send amount to another wallet
 *
 * Fully covers send useace and get transaction to blockchain
 * @param selector method returning transaction obejct
 *
 * @operation reveal operation when wallet is not activated yet
 * @operation transaction operation
 *
 * @example
 * of({}).
 * initializeWallet(state => { ...wallet }).
 * transaction(state => ({
 *  amount: "20"
 *  to: "wallet address"
 *  fee: "0.01"
 * })).
 * confirmOperation(state => ({
 *  injectionOperation: state.injectionOperation,
 * })).
 * then(state => console.log('amount transfered'))
 *
 */
exports.transaction = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { transaction: selector(state) }))), 
// get contract counter
contract_1.counter(), 
// get contract managerKey
contract_1.managerKey(), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] transaction: ' + state.transaction.amount + ' ꜩ  fee:' + state.transaction.fee + ' ' + 'from "' + state.wallet.publicKeyHash + '" to "' + state.transaction.to + '"');
}), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        if (typeof state.wallet.publicKey === undefined) {
            console.warn(`[transaction] Wallet public key not available!`);
        }
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey || '',
            source: state.wallet.publicKeyHash,
            fee: "10000",
            gas_limit: "15000",
            storage_limit: "277",
            counter: (++state.counter).toString()
        });
    }
    operations.push({
        kind: "transaction",
        source: state.wallet.publicKeyHash,
        destination: state.transaction.to,
        amount: common_1.parseAmount(state.transaction.amount).toString(),
        fee: common_1.parseAmount(state.transaction.fee).toString(),
        gas_limit: "11000",
        storage_limit: "277",
        parameters: state.transaction.parameters,
        counter: (++state.counter).toString()
    });
    return Object.assign({}, state, { operations: operations });
}), 
// tap((state) => console.log("[+] trasaction: operation " , state.operations)),
// create operation 
operation_1.operation());
