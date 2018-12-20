import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import {
  State, OperationMetadata, OriginationOperationMetadata, OriginateContract, parseAmount
} from "../common";
import { operation, StateOperations } from "../operation";

import { counter, StateCounter } from "./getContractCounter";
import { managerKey, StateManagerKey } from './getContractManagerKey';


export type StateOriginateContract = {
  originateContract: OriginateContract
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
export const originateContract = <T extends State>(selector: (state: T) => OriginateContract) => (source: Observable<T>) => source.pipe(

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
        fee: parseAmount(state.originateContract.fee).toString(),
        gas_limit: "10100",
        storage_limit: "277",
        counter: (++state.counter).toString(),
      })
    }

    const originationOperation: OriginationOperationMetadata = {
      kind: "origination",
      source: state.wallet.publicKeyHash,
      fee: parseAmount(state.originateContract.fee).toString(),
      balance: parseAmount(state.originateContract.amount).toString(),
      gas_limit: "10100",
      storage_limit: "277",
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
    } as T & StateOriginateContract & StateCounter & StateManagerKey & StateOperations
  }),

  // create operation 
  operation()
)