import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, Mempool, PendingOperation, rpc, MempoolOperation } from "../common";

export type StateMempool = {
  mempool: Mempool
}

export type StatePendingOperation = {
  pendingOperation: PendingOperation
}


/**
 * Gets list of applied and refused operations in mempool for specific wallet
 * @param selector method returning operation object with public key used as filter
 */
export const pendingOperation = <T extends State>(selector: (state: T) => PendingOperation) => (source: Observable<T>) => source.pipe(

  map(state => (
    {
      ...state as any,
      pendingOperation: selector(state)
    } as T & StatePendingOperation
  )),

  pendingOperationsAtomic(),

  // get operation for address in mempool
  map((state) => ({
    applied: [
      ...state.mempool.applied
        .filter((operation) => operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ],
    refused: [
      ...state.mempool.refused
        .filter((operation) => operation.contents[0].source === state.pendingOperation.publicKeyHash)
    ]
  })),

  tap(state => console.warn('[pendingOperation]', state))
);


/**
 * Gets mempool operations
 * 
 * @url /chains/main/mempool/pending_operations
 */
export const pendingOperationsAtomic = <T extends State>() => (source: Observable<T>) => source.pipe(

  rpc<T>(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
  }))
) as Observable<T & StateMempool>