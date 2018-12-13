import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { State, ActivateWallet } from "../types";
import { operation } from "../operation";


/**
  * Activate wallet
  */
 export const activateWallet = <T extends State>(fn: (state: T) => ActivateWallet) => (source: Observable<T>) => source.pipe(

    map(state => ({
      ...state,
      activateWallet: fn(state)
    })),
  
    // prepare config for operation
    map(state => {
      const operations = []
  
      operations.push({
        kind: "activate_account",
        pkh: state.wallet.publicKeyHash,
        secret: state.activateWallet.secret
      })
  
      return {
        ...state,
        operations: operations
      }
  
    }),
  
    // create operation 
    operation()
  )