import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { State, ActivateWallet } from "../common";
import { operation, StateOperations } from "../operation";

export type StateActivateWallet = {
  activateWallet: ActivateWallet
}


/**
  * Activate generated wallet address
  * 
  * @operation activate_account
  */
export const activateWallet = <T extends State>(selector: (state: T) => ActivateWallet) => (source: Observable<T>) => source.pipe(

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