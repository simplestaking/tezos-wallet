import { Observable, of } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";

import { State, OperationMetadata, OriginationOperationMetadata, OriginatedContract, parseAmount } from "../common";
import { operation, StateOperations, validateOperation, StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation, StateValidatedOperations } from "../operation";
import { constants, head, StateConstants, StateHead } from "../head";

import { counter, StateCounter } from "./getContractCounter";
import { managerKey, StateManagerKey } from './getContractManagerKey';
import { StateTransaction } from "index";

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
    console.log(`[+] originate : from "${state.wallet.publicKeyHash}"`);
  }),

  head(),

  constants(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // prepare config for operation
  map(state => {
    const withTestRun = state.originateContract.testRun || false;
    const operations: OperationMetadata[] = [];

    // revealed wallet already has a manager
    if (state.manager_key === null) {

      if (typeof state.wallet.publicKey === 'undefined') {
        console.warn('[originateContract] Public key not available in wallet. Using empty string.');
      }

      operations.push({
        kind: "reveal",
        public_key: state.wallet.publicKey || '',
        source: state.wallet.publicKeyHash,
        fee: parseAmount(state.originateContract.fee).toString(),
        // extra  gas is for safety 
        gas_limit: withTestRun? state.constants.hard_gas_limit_per_operation : "10300",
        storage_limit: "0",
        counter: (++state.counter).toString(),
      })
    }

    const originationOperation: OriginationOperationMetadata = {
      kind: "origination",
      source: state.wallet.publicKeyHash,
      fee: parseAmount(state.originateContract.fee).toString(),
      balance: parseAmount(state.originateContract.amount).toString(),
      // extra gas is for safety 
      gas_limit: withTestRun? state.constants.hard_gas_limit_per_operation : "10300",
      storage_limit: "257",
      counter: (++state.counter).toString(),
      spendable: true,
      delegatable: true,
      delegate: state.originateContract.to,
      manager_pubkey: state.manager_key
    };

    operations.push(originationOperation);

    return {
      ...state as any,
      operations: operations
    } as T & StateOriginateContract & StateHead & StateConstants & StateCounter & StateManagerKey & StateOperations
  }),

  // run operation on node and calculate its gas consumption and storage size
  flatMap(state => {
    return (state.originateContract.testRun ? validateOperation() : of(state)) as  Observable<T & StateOriginateContract & StateCounter & StateHead & StateConstants & StateManagerKey & StateOperations>;
  }),

  // create operation 
  operation(),

  tap<T & StatePreapplyOperation>(state => {
    const origination = state.preapply[0].contents.filter(op => op.kind === "origination")[0];

    origination && console.log(`[+] Originated contract address: "${origination.metadata.operation_result.originated_contracts}"`);
  })
) as Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & StateOriginateContract & StateSignOperation & StatePreapplyOperation & StateInjectionOperation & StateValidatedOperations>