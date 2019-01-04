import { Observable, throwError } from "rxjs";
import { flatMap, tap, map } from "rxjs/operators";

import { State, rpc } from "../common";
import { head, StateHead } from "../head";
// prevent circular dependency
import { counter, StateCounter } from '../contract/getContractCounter';
import { managerKey, StateManagerKey } from "../contract/getContractManagerKey";

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

  tap(state => {
    console.log('#### Forged operation', state.operation)
    console.log('Size', state.operation.length)
  }),

  map(updateFeesForOperation),

  // forge again with correct fees
  // @TODO: do we need to forge again as params changed?
  //forgeOperationAtomic(),

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
export const forgeOperationAtomic = <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => source.pipe(

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

function updateFeesForOperation(state: State & StateHead & StateCounter & StateManagerKey & StateOperation & StateOperations) {

  state.operations.forEach(operation => {

    // ignore fees calculation for wallet activation
    // @TODO: should it be considered??
    if(operation.kind === "activate_account"){
      return;
    }

    // value in nanotez
    // depends on gas limit and operation byte size in blockchain
    // operation is hex therefore we can say that char is 1 byte
    const estimatedFee = 100 + parseInt(operation.gas_limit) * 0.1 + state.operation.length;
    const fee = parseFloat(operation.fee);

    // ensuring that fee is in nanotez however we expect it to be provided in tez!
    const feeAsNano = fee > 1000 ? fee : fee * 1000000; // convert from tez to nanotez

    console.log(`[+] fees: defined "${fee}" estimated "${estimatedFee}"`);

    if (estimatedFee > feeAsNano) {
      console.warn('Defined fee is lower than fail safe minimal fee! Overriding it.');

      operation.fee = estimatedFee.toString();
      // shall we throw error here?
      //return throwError(fee);
    }
  })

  return state;
}