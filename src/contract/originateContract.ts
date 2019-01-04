import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, OperationMetadata, OriginationOperationMetadata, OriginatedContract, parseAmount } from "../common";
import { operation, StateOperations, validateOperation } from "../operation";
import { constants, head, StateConstants, StateHead } from "../head";

import { counter, StateCounter } from "./getContractCounter";
import { managerKey, StateManagerKey } from './getContractManagerKey';

// import {StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation, StateHead  } from '..';

export type StateOriginateContract = {
  originateContract: OriginatedContract
};

/**
 * Originate smart contract from implicit wallet. Contract will be used for delegation.
 * Complete operations stack 
 * 
 * @param selector derives origination data from state
 * 
 * @operation reveal for non revealed wallet
 * @operation origination 
 * 
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * originateContract(state => ({
 *  fee: "100"
 *  amount: "5"
 *  to: "some address"
 * }))
 *  
 */
export const originateContract = <T extends State>(selector: (state: T) => OriginatedContract) => (source: Observable<T>) => source.pipe(

  // get meta data for contract
  map(state => (
    {
      ...state as any,
      originateContract: selector(state)
    } as T & StateOriginateContract
  )),

  // display transaction info to console
  tap(state => {
    console.log('[+] originate : from "' + state.wallet.publicKeyHash)
  }),

  head(),

  constants(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // prepare config for operation
  map(state => {
    const operations: OperationMetadata[] = [];

    // revealed wallet already has a manager
    if (state.manager_key.key === undefined) {

      if (typeof state.wallet.publicKey === 'undefined') {
        console.warn('[originateContract] Public key not available in wallet. Using empty string.');
      }

      operations.push({
        kind: "reveal",
        public_key: state.wallet.publicKey || '',
        source: state.wallet.publicKeyHash,
        fee: "0",
        gas_limit: state.constants.hard_gas_limit_per_operation,
        storage_limit: state.constants.hard_storage_limit_per_operation,
        counter: (++state.counter).toString(),
      })
    }

    const originationOperation: OriginationOperationMetadata = {
      kind: "origination",
      source: state.wallet.publicKeyHash,
      fee: parseAmount(state.originateContract.fee).toString(),
      balance: parseAmount(state.originateContract.amount).toString(),
      gas_limit: state.constants.hard_gas_limit_per_operation,
      storage_limit: state.constants.hard_storage_limit_per_operation,
      counter: (++state.counter).toString(),
      spendable: true,
      delegatable: true,
      delegate: state.originateContract.to,
      [state.wallet.node.name === "main" ? "managerPubkey" : "manager_pubkey"]: state.manager_key.manager
    };

    operations.push(originationOperation);

    return {
      ...state as any,
      operations: operations
    } as T & StateOriginateContract & StateHead & StateConstants & StateCounter & StateManagerKey & StateOperations
  }),

  // run operation on node and calculate its gas consumption and storage size
  validateOperation(),

  // create operation 
  operation()
)