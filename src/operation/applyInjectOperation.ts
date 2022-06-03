import { Observable, of, throwError } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';

import { counter } from '../contract';
import { InjectionOperation, PreapplyOperation, rpc, State } from '../common';
import { StateHead } from '../head';
import { StateOperations } from './operation';
import { StateSignOperation } from './signOperation';

export type StatePreapplyOperation = {
  preapply: PreapplyOperation
}

export type StateInjectionOperation = {
  injectionOperation: InjectionOperation
}

/**
 * Validates and inject operation into tezos blockain
 * Can be applied to any prepared operation
 * 
 * @throws InjectionError when operation validation fails on node
 */
export const applyAndInjectOperation = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(

  //get counter
  counter(),

  // preapply operation
  preapplyOperations(),

  tap(state => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)),

  // check for errors
  flatMap(state => {
    const result = state.preapply[0].contents[0].metadata;

    // @@TODO: no such a field as operation_result
    return result.operation_result && result.operation_result.status === "failed" ?
      throwError({ 
        state,
        response: result.operation_result.errors 
      }) :
      of(state)
  }),

  // inject operation
  injectOperations(),

  tap((state) => console.log("[+] operation: " + state.wallet.node.tzstats.url + state.injectionOperation))
);


/**
 * Prevalidates (preapply) operation on tezos node
 * 
 * @url /chains/main/blocks/head/helpers/preapply/operations
 */
const preapplyOperations = <T extends State & StateHead & StateSignOperation>() => (source: Observable<T>) => source.pipe(

  rpc<T>((state) => ({
    url: '/chains/main/blocks/head/helpers/preapply/operations',
    path: 'preapply',
    payload: [{
      protocol: state.head.metadata.next_protocol,
      branch: state.head.hash,
      contents: state.operations,
      signature: state.signOperation.signature,
    }],
  })),
) as Observable<T & StatePreapplyOperation>


/**
 * Inbjects prevalidated operation to Tezos blockchain
 * 
 * @url /injection/operation
 */
const injectOperations = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(
  rpc<T>((state) => {
    return ({
      url: '/injection/operation',
      path: 'injectionOperation',
      payload: `"${state.signOperation.signedOperationContents}"`,
    });
  }),
) as Observable<T & StateInjectionOperation>
