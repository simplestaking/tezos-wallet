import { Observable, throwError, of } from "rxjs";
import { map, tap, delay, flatMap } from "rxjs/operators";

import { State, ConfirmOperation, StateConfirmOperation, MempoolOperation } from "../types";
import { checkPendingOperations } from "./pending";

/**
 * Wait until operation is confirmed & moved from mempool to head
 */
export const confirmOperation = <T extends State>(selector: (state: T) => ConfirmOperation) => (source: Observable<T>): Observable<T> => source.pipe(

    map(state => ({
      ...state,
      // why?? confirmOperation is never created other way
      //confirmOperation: (fn && typeof fn === 'function') ? fn(state) : state.confirmOperation
      confirmOperation: selector(state)
    })),
  
    tap((state) => console.log('[-] pending: operation "' + state.confirmOperation.injectionOperation + '"')),
  
    // wait 3 sec for operation 
    delay(3000),
  
    // call node and look for operation in mempool
    checkPendingOperations(),
  
    // if we find operation in mempool call confirmOperation() again
    flatMap((state) => {
      // check if operation is refused
      if (state.mempool.refused.filter(hasRefusedOperationInMempool, state).length > 0) {
        console.error('[-] operation refused: ', state.mempool.refused, state.confirmOperation.injectionOperation)
  
        return throwError(state.mempool.refused);
      } else {
  
        return state.mempool.applied.filter(hasAppliedOperationInMempool, state).length > 0 ?
          of(state).pipe(
            confirmOperation(selector)
          ) :
          source
      }
    })
  )
  
  function hasRefusedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation) {
    return this.confirmOperation.injectionOperation === operation.hash;
  };
  
  function hasAppliedOperationInMempool(this: StateConfirmOperation, operation: MempoolOperation) {
    return this.confirmOperation.injectionOperation === operation.hash;
  }