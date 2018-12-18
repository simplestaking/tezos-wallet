import { Observable } from "rxjs";
import { flatMap } from "rxjs/operators";

import { State, StateOperations, StateHead, StateOperation, StateCounter, StateManagerKey, StateSignOperation } from "../types";
import { rpc } from "../rpc";
import * as utils from "../utils";
import { head, counter, managerKey } from "../helpers";


/**
 * Forge operation in blocchain
 */
export const forgeOperation = <T extends State & StateOperations>() => (source: Observable<T>) => source.pipe(

    // get head and counter
    head(),
  
    // @TODO: do we need special counter here?
    // get contract counter
    counter(),
  
    // get contract managerKey
    managerKey(),
  
    forgeOperationAtomic(),
  
    // add signature to state 
    // 
    // TODO: move and just keep signOperation and create logic inside utils 
    // tap(state => console.log('[operation]', state.walletType, state)),
    flatMap(state => {
  
      if (state.wallet.type === utils.WalletType.TREZOR_T) {
        return utils.signOperationTrezor(state);
  
      } else {
        return utils.signOperation(state);
      }
    })
  ) as Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & StateSignOperation>
  
  export const forgeOperationAtomic = <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => source.pipe(
  
    // create operation
    rpc<T>(state => ({
      url: '/chains/' + state.head.chain_id + '/blocks/' + state.head.hash + '/helpers/forge/operations',
      path: 'operation',
      payload: {
        branch: state.head.hash,
        contents: state.operations
      }
    }))
  ) as Observable<T & StateOperation>