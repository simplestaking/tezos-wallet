import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, SetDelegate, OperationMetadata, parseAmount } from "../common";
import { counter, managerKey, StateCounter, StateManagerKey } from "../contract";
import { operation, StateOperations } from "../operation";


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

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] setDelegate: from "' + state.wallet.publicKeyHash + '" to "' + state.setDelegate.to + '"')
  }),

  tap(state => {
    console.log('[+] wallet: from "' + state.wallet)
  }),

  // prepare config for operation
  map(state => {
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
        gas_limit: "10100",
        storage_limit: "277",
        counter: (++state.counter).toString(),
      })
    }

    operations.push({
      kind: "delegation",
      source: state.wallet.publicKeyHash,
      fee: parseAmount(state.setDelegate.fee).toString(),
      gas_limit: "10100",
      storage_limit: "277",
      counter: (++state.counter).toString(),
      delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
    })

    return {
      ...state as any,
      operations: operations
    } as T & StateSetDelegate & StateCounter & StateManagerKey & StateOperations
  }),

  // create operation 
  operation()
);