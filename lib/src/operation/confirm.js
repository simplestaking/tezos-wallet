"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const pending_1 = require("./pending");
/**
 * Wait until operation is confirmed & moved from mempool to head
 */
exports.confirmOperation = (selector) => (source) => source.pipe(operators_1.map(state => (Object.assign({}, state, { 
    // why?? confirmOperation is never created other way
    //confirmOperation: (fn && typeof fn === 'function') ? fn(state) : state.confirmOperation
    confirmOperation: selector(state) }))), operators_1.tap((state) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')), 
// wait 3 sec for operation 
operators_1.delay(3000), pending_1.pendingOperationsAtomic(), 
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
function hasRefusedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
;
function hasAppliedOperationInMempool(operation) {
    return this.confirmOperation.injectionOperation === operation.hash;
}
//# sourceMappingURL=confirm.js.map