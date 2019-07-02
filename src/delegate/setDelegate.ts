import { Observable, of } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";

import { State, SetDelegate, OperationMetadata, parseAmount } from "../common";
import { counter, managerKey, StateCounter, StateManagerKey, StateOriginateContract } from "../contract";
import { operation, StateOperations, validateOperation, StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation } from "../operation";
import { constants, head, StateHead, StateConstants } from "../head";

// import {StateHead, StateSignOperation, StateOperation, StatePreapplyOperation, StateInjectionOperation } from '..';

export type StateSetDelegate = {
  setDelegate: SetDelegate
};


/**
 *  Set delegation rights to tezos address
 * 
 * @param selector provides data for delegation operation
 * 
 * @operation reveal when wallet was not revealed yet
 * @operation delegation
 * 
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * setDelegate(state => ({
 *  fee: string
 *  to: string
 * }))
 * 
 */
export const setDelegation = <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => source.pipe(

  map(state => (
    {
      ...state as any,
      setDelegate: selector(state)
    } as T & StateSetDelegate
  )),

  head(),

  constants(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log(`[+] setDelegate: from "${state.wallet.publicKeyHash}" to "${state.setDelegate.to }"`);
  }),

  tap(state => {
    console.log(`[+] wallet: from "${state.wallet}"`);
  }),

  // prepare config for operation
  map(state => {
    const withTestRun = state.setDelegate.testRun || false;
    const operations: OperationMetadata[] = [];

    if (state.manager_key.key === undefined) {

      if (typeof state.wallet.publicKey === 'undefined') {
        console.warn('[setDelegation] Public key not available in wallet. Using empty string.');
      }

      operations.push({
        kind: "reveal",
        public_key: state.wallet.publicKey || '',
        source: state.wallet.publicKeyHash,
        fee: parseAmount(state.setDelegate.fee).toString(),
        // extra gas is for safety 
        gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
        storage_limit: "0",
        counter: (++state.counter).toString(),
      })
    }

    operations.push({
      kind: "delegation",
      source: state.wallet.publicKeyHash,
      fee: parseAmount(state.setDelegate.fee).toString(),
      // extra gas is for safety 
      gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
      storage_limit: "0",
      counter: (++state.counter).toString(),
      delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    })

    return {
      ...state as any,
      operations: operations
    } as T & StateSetDelegate & StateHead & StateConstants & StateCounter & StateManagerKey & StateOperations
  }),

  // run operation on node and calculate its gas consumption and storage size
  flatMap(state => {
    return (state.setDelegate.testRun ? validateOperation() : of(state)) as  Observable<T & StateSetDelegate & StateCounter & StateHead & StateConstants & StateManagerKey & StateOperations>;
  }),

  // create operation 
  operation()
) as Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>