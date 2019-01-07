import { Observable, throwError, of } from "rxjs";
import { map, tap, delay, flatMap } from "rxjs/operators";

import { State, ConfirmOperation, InjectionOperation, MempoolOperation } from "../common";
import { pendingOperationsAtomic } from "./pendingOperation";


export type StateConfirmOperation = {
  confirmOperation: {
    injectionOperation: InjectionOperation
  }
}


/**
 * Wait until operation is confirmed & moved from mempool to head
 * 
 * Polls mempool to check when operation is confirmed and moved to head
 * @param selector method returning operation hash to check in mempool
 */
export const confirmOperation = <T extends State>(selector: (state: T) => ConfirmOperation) => (source: Observable<T>): Observable<T> => source.pipe(

  map(state => (
    {
      ...state as any,
      confirmOperation: selector(state)
    } as T & StateConfirmOperation
  )),

  tap((state) => console.log(`[-] pending: operation "${state.confirmOperation.injectionOperation}"`)),

  // wait 3 sec for operation 
  delay(3000),

  pendingOperationsAtomic(),

  // if we find operation in mempool call confirmOperation() again
  flatMap((state) => {
    // check if operation is refused
    if (state.mempool.refused.filter(hasRefusedOperationInMempool, state).length > 0) {
      console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation)

      return throwError(state.mempool.refused);

    } else {

      return state.mempool.applied.filter(hasAppliedOperationInMempool, state).length > 0 ?
        of(state).pipe(confirmOperation(selector)) :
        source
    }
  })
);

/**
 * Check if mempool contains operation among refused
 * @this state with operation to confirm
 * @param operation mempool operation
 */
function hasRefusedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation) {
  return this.confirmOperation.injectionOperation === operation.hash;
};

/**
 * Check if mempool contains operation among applied
 * @this state with operation to confirm
 * @param mempool operation
 */
function hasAppliedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation) {
  return this.confirmOperation.injectionOperation === operation.hash;
};