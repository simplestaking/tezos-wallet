import { Observable } from "rxjs";
import { flatMap } from "rxjs/operators";

import { State, rpc } from "../common";
import { head, StateHead } from "../head";
// prevent circular dependency
import { counter } from '../contract/getContractCounter';
import { managerKey } from "../contract/getContractManagerKey";

import { signOperationTrezor, signOperation } from "./signOperation";
import { StateOperations } from "./operation";

// import {StateManagerKey, StateSignOperation, StateCounter} from '..';

export type StateOperation = {
  operation: string
};


/**
 * Forge operation in blocchain.
 * Converts operation into binary format and signs operation using script or Trezor
 * 
 * 
 */
export const forgeOperation = <T extends State & StateOperations>() => (source: Observable<T>) => source.pipe(

  // get head and counter
  head(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  forgeOperationAtomic(),

  // add signature to state     
  flatMap(state => {

    if (state.wallet.type === 'TREZOR_T') {
      return signOperationTrezor(state);

    } else {
      return signOperation(state);
    }
  })
)


/**
 * Converts operation to binary format on node
 * 
 * @url /chains/[chainId]/blocks/[headHash]/helpers/forge/operations
 */
const forgeOperationAtomic = <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => source.pipe(

  // create operation
  rpc<T>(state => ({
    url: `/chains/${state.head.chain_id}/blocks/${state.head.hash}/helpers/forge/operations`,
    path: 'operation',
    payload: {
      branch: state.head.hash,
      contents: state.operations
    }
  }))
) as Observable<T & StateOperation>