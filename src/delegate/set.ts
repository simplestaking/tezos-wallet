import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, SetDelegate, OperationMetadata, StateSetDelegate } from "../types";
import * as utils from '../utils';
import { counter, managerKey } from "../helpers";
import { operation } from "../operation";


/**
 *  Set delegation rights to tezos address
 */
export const setDelegation = <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => source.pipe(

    map<T, T & StateSetDelegate>(state => ({
      ...state as any,
      setDelegate: selector(state)
    })),
  
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
  
        operations.push({
          kind: "reveal",
          public_key: state.wallet.publicKey,
          source: state.wallet.publicKeyHash,
          fee: utils.parseAmount(state.setDelegate.fee).toString(),
          gas_limit: "10100",
          storage_limit: "277",
          counter: (++state.counter).toString(),
        })
      }
  
      operations.push({
        kind: "delegation",
        source: state.wallet.publicKeyHash,
        fee: utils.parseAmount(state.setDelegate.fee).toString(),
        gas_limit: "10100",
        storage_limit: "277",
        counter: (++state.counter).toString(),
        delegate: !state.setDelegate.to ? state.wallet.publicKeyHash : state.setDelegate.to,
      })
  
      return {
        ...state as any,
        operations: operations
      }
    }),
  
    // create operation 
    operation()
  )