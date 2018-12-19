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
 *  Transaction XTZ from one wallet to another
 */
exports.transaction = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { transaction: selector(state) }))), 
// get contract counter
helpers_1.counter(), 
// get contract managerKey
helpers_1.managerKey(), 
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
        amount: utils.parseAmount(state.transaction.amount).toString(),
        fee: utils.parseAmount(state.transaction.fee).toString(),
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
//# sourceMappingURL=create.js.map