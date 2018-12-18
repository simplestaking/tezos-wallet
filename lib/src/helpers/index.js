"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../rpc");
/**
 * Get head for operation
 */
exports.head = () => (source) => source.pipe(
// get head
rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head',
    path: 'head',
})));
/**
 * Get counter for contract
 */
exports.counter = () => (source) => source.pipe(
// get counter for contract
rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/counter',
    path: 'counter',
})));
/**
* Get manager key for contract
*/
exports.managerKey = () => (source) => source.pipe(
// get manager key for contract 
rpc_1.rpc((state) => ({
    url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
    path: 'manager_key' // @TODO: should not be 'manager' ??
})));
