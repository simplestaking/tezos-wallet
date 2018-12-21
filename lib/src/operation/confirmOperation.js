"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const pendingOperation_1 = require("./pendingOperation");
/**
 * Wait until operation is confirmed & moved from mempool to head
 *
 * Polls mempool to check when operation is confirmed and moved to head
 * @param selector method returning operation hash to check in mempool
 */
exports.confirmOperation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { confirmOperation: selector(state) }))), operators_1.tap((state) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')), 
// wait 3 sec for operation 
operators_1.delay(3000), pendingOperation_1.pendingOperationsAtomic(), 
// if we find operation in mempool call confirmOperation() again
operators_1.flatMap((state) => {
    // check if operation is refused
    if (state.mempool.refused.filter(hasRefusedOperationInMempool, state).length > 0) {
        console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation);
        return rxjs_1.throwError(state.mempool.refused);
    }
    else {
        return state.mempool.applied.filter(hasAppliedOperationInMempool, state).length > 0 ?
            rxjs_1.of(state).pipe(exports.confirmOperation(selector)) :
            source;
    }
}));
/**
 * Check if mempool contains operation among refused
 * @this state with operation to confirm
 * @param operation mempool operation
 */
function hasRefusedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
;
/**
 * Check if mempool contains operation among applied
 * @this state with operation to confirm
 * @param mempool operation
 */
function hasAppliedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
;
//# sourceMappingURL=confirmOperation.js.map