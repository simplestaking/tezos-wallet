import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { State, ActivateWallet, StateActivateWallet, StateOperation, StateOperations } from "../types";
import { operation } from "../operation";


/**
  * Activate wallet
  */
 export const activateWallet = <T extends State>(fn: (state: T) => ActivateWallet) => (source: Observable<T>) => source.pipe(

    map<T, T & StateActivateWallet>(state => ({
     ...state as any,
      activateWallet: fn(state)
    })),
  
    // prepare config for operation
    map<T & StateActivateWallet, T & StateActivateWallet & StateOperations>(state => {
      const operations = []
  
      operations.push({
        kind: "activate_account",
        pkh: state.wallet.publicKeyHash,
        secret: state.activateWallet.secret
      })
  
      return {
        ...state as any,
        operations: operations
      }
  
    }),
  
    // create operation 
    operation()
  )