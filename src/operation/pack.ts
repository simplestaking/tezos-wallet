import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { State, StateOperations, OperationMetadata, TransactionOperationMetadata, StatePackOperationParameters } from "../types";
import { rpc } from "../rpc";


/** 
 * Pack operation parameters
 */
export const packOperationParameters = <T extends State & StateOperations>() => (source: Observable<T>) => source.pipe(

    tap(state => console.log('[+] packOperationParameters', state)),
  
    // get packed transaction parameters  
    packOperationParametersAtomic(),
  
    tap(state => console.log('[+] packOperationParameters', state.packOperationParameters))
  
  )
  
  const packOperationParametersAtomic = <T extends State & StateOperations>() => (source: Observable<T>) => source.pipe(
  
    rpc<T>((state) => {
      const lastOperation: OperationMetadata = <TransactionOperationMetadata>state.operations[state.operations.length - 1];
  
      return {
        url: '/chains/main/blocks/head/helpers/scripts/pack_data',
        path: 'packOperationParameters',
        payload: {
          data: lastOperation.parameters || {},
          type: {}
        }
      }
    })
  ) as Observable<T & StatePackOperationParameters>