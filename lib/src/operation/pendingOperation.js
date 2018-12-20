"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const common_1 = require("../common");
/**
 * Gets list of applied and refused operations in mempool for specific wallet
 * @param selector method returning operation object with public key used as filter
 */
exports.pendingOperation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { pendingOperation: selector(state) }))), exports.pendingOperationsAtomic(), 
// get operation for address in mempool
operators_1.map((state) => ({
    applied: [
        ...state.mempool.applied
            .filter((operation) => operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ],
    refused: [
        ...state.mempool.refused
            .filter((operation) => operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ]
})), operators_1.tap(state => console.warn('[pendingOperation]', state)));
/**
 * Gets mempool operations
 *
 * @url /chains/main/mempool/pending_operations
 */
exports.pendingOperationsAtomic = () => (source) => source.pipe(common_1.rpc(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
})));
