import { Observable, throwError, of } from "rxjs";
import { tap, flatMap } from "rxjs/operators";

import { counter } from "../helpers";
import { State, StateHead, StateSignOperation, StatePreapplyOperation, StateOperations, StateInjectionOperation } from "../types";
import { rpc } from "../rpc";



const preapplyOperations = <T extends State & StateHead & StateSignOperation>() => (source: Observable<T>) => source.pipe(

    rpc<T>((state) => ({
      url: '/chains/main/blocks/head/helpers/preapply/operations',
      path: 'preapply',
      payload: [{
        protocol: state.head.protocol,
        branch: state.head.hash,
        contents: state.operations,
        signature: state.signOperation.signature
      }]
    }))
  ) as Observable<T & StatePreapplyOperation>
  
  const injectOperations = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(
    rpc<T>((state) => ({
      url: '/injection/operation',
      path: 'injectionOperation',
      payload: `"${state.signOperation.signedOperationContents}"`
    }))
  ) as Observable<T & StateInjectionOperation>
  
  
  /**
   * Apply and inject operation into node
   */
  export const applyAndInjectOperation = <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => source.pipe(
  
    //get counter
    counter(),
  
    // preapply operation
    preapplyOperations(),
  
    tap((state) => console.log("[+] operation: preapply ", state.preapply[0].contents[0].metadata.operation_result)),
  
    // check for errors
    flatMap(state => {
      const result = state.preapply[0].contents[0].metadata;
  
      // @@TODO: no such a field as operation_result
      return result.operation_result && result.operation_result.status === "failed" ?
        throwError({ response: result.operation_result.errors }) :
        of(state)
    }),
  
    // inject operation
    injectOperations(),
  
    tap((state) => console.log("[+] operation: " + state.wallet.node.tzscan.url + state.injectionOperation))
  );