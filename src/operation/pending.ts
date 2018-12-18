import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, StateMempool, StatePendingOperation, PendingOperation } from "../types";
import { rpc } from "../rpc";

export const pendingOperationsAtomic = <T extends State>() => (source: Observable<T>) => source.pipe(

  rpc<T>(() => ({
    url: '/chains/main/mempool/pending_operations',
    path: 'mempool'
  }))
) as Observable<T & StateMempool>

export const pendingOperation = <T extends State>(selector: (state: T) => PendingOperation) => (source: Observable<T>) => source.pipe(

  map<T, T & StatePendingOperation>(state => ({
    ...state as any,
    pendingOperation: selector(state)
  })),

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
)