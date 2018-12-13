import { Observable } from "rxjs";

import { State, StateMempool } from "../types";
import { rpc } from "../rpc";

export const checkPendingOperations = <T extends State>() => (source: Observable<T>) => source.pipe(

    rpc<T>(() => ({
      url: '/chains/main/mempool/pending_operations',
      path: 'mempool'
    }))
  ) as Observable<T & StateMempool>