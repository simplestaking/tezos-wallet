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
const helpers_1 = require("../helpers");
const utils = __importStar(require("../utils"));
const operation_1 = require("../operation");
/**
 * Originate new delegatable contract from wallet
 */
exports.originateContract = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { originateContract: selector(state) }))), 
// display transaction info to console
operators_1.tap(state => {
    console.log('[+] originate : from "' + state.wallet.publicKeyHash);
}), 
// get contract counter
helpers_1.counter(), 
// get contract managerKey
helpers_1.managerKey(), 
// prepare config for operation
operators_1.map(state => {
    const operations = [];
    if (state.manager_key.key === undefined) {
        operations.push({
            kind: "reveal",
            public_key: state.wallet.publicKey,
            source: state.wallet.publicKeyHash,
            fee: utils.parseAmount(state.originateContract.fee).toString(),
            gas_limit: "10100",
            storage_limit: "277",
            counter: (++state.counter).toString(),
        });
    }
    const originationOperation = {
        kind: "origination",
        source: state.wallet.publicKeyHash,
        fee: utils.parseAmount(state.originateContract.fee).toString(),
        balance: utils.parseAmount(state.originateContract.amount).toString(),
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
