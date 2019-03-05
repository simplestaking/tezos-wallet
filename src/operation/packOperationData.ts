import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { State, OperationMetadata, TransactionOperationMetadata, rpc, PackOperationParameters } from "../common";
import { StateOperations } from "./operation";

export type StatePackOperationParameters = {
  packOperationParameters: PackOperationParameters
}

/** 
 * Serialize operation parameters into binary format
 */
export const packOperationParameters = <T extends State & StateOperations>() => (source: Observable<T>) => source.pipe(

  tap(state => console.log('[+] packOperationParameters: ', state)),

  // get packed transaction parameters  
  packOperationParametersAtomic(),

  tap(state => console.log('[+] packOperationParameters: ', state.packOperationParameters))
);


/**
 * Serialize operation parameters on node
 * 
 * @url /chains/main/blocks/head/helpers/scripts/pack_data
 */
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