import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { State, ActivatedWallet } from "../common";
import { operation, StateOperations } from "../operation";

//import {StateInjectionOperation, StatePreapplyOperation, StateSignOperation, StateOperation, StateHead, StateCounter, StateManagerKey } from '..'

export type StateActivateWallet = {
  activateWallet: ActivatedWallet
}


/**
  * Activate generated wallet address
  * 
  * @operation activate_account
  * @returns Observable
  */
export const activateWallet = <T extends State>(selector: (state: T) => ActivatedWallet) => (source: Observable<T>) => source.pipe(

  map(state => (
    {
      ...state as any,
      activateWallet: selector(state)
    } as T & StateActivateWallet
  )),

  // prepare config for operation
  map(state => {
    const operations = [];

    operations.push({
      kind: "activate_account",
      pkh: state.wallet.publicKeyHash,
      secret: state.activateWallet.secret      
    });

    return {
      ...state as any,
      operations: operations
    } as T & StateActivateWallet & StateOperations
  }),

  // create operation 
  operation()
)