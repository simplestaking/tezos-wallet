import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { State, Transaction, OperationMetadata, parseAmount, TransactionOperationMetadata } from "../common";
import { counter, managerKey, StateCounter, StateManagerKey } from "../contract";
import { operation, StateOperations, validateOperation, StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation } from "../operation";
import { constants, StateConstants, head, StateHead } from "../head";

// import {StateInjectionOperation, StatePreapplyOperation, StateSignOperation, StateOperation, StateHead } from '..'

export type StateTransaction = {
  transaction: Transaction
}


/**
 * Send amount to another wallet
 * 
 * Fully covers send useace and get transaction to blockchain
 * @param selector method returning transaction obejct
 * 
 * @operation reveal operation when wallet is not activated yet
 * @operation transaction operation
 * 
 * @example
 * of({}).
 * initializeWallet(state => { ...wallet }).
 * transaction(state => ({
 *  amount: "20"
 *  to: "wallet address"
 *  fee: "0.01"
 * })).
 * confirmOperation(state => ({
 *  injectionOperation: state.injectionOperation,
 * })).
 * then(state => console.log('amount transfered'))
 * 
 */
export const transaction = <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => source.pipe(

  map(state => (
    {
      ...state as any,
      transaction: selector(state)
    } as T & StateTransaction
  )),

  // get head constants for estimating transaction costs
  constants(),

  head(),

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    // ꜩ  fee:' + state.transaction.fee + ' '
    console.log(`[+] transaction: ${state.transaction.amount} from "${state.wallet.publicKeyHash}" to "${state.transaction.to}"`);
  }),

  // prepare config for operation
  map(state => {
    const operations: OperationMetadata[] = [];

    if (state.manager_key.key === undefined) {

      if (typeof state.wallet.publicKey === undefined) {
        console.warn(`[transaction] Wallet public key not available!`);
      }

      operations.push({
        kind: "reveal",
        public_key: state.wallet.publicKey || '',
        source: state.wallet.publicKeyHash,
        fee: "0",
        gas_limit: state.constants.hard_gas_limit_per_operation,
        storage_limit: "257",
        counter: (++state.counter).toString()
      })
    }

    const transaction: TransactionOperationMetadata = {
      kind: "transaction",
      source: state.wallet.publicKeyHash,
      destination: state.transaction.to,
      amount: parseAmount(state.transaction.amount).toString(),
      fee: parseAmount(state.transaction.fee).toString(),
      gas_limit: state.constants.hard_gas_limit_per_operation,
      storage_limit: "257",
      counter: (++state.counter).toString()
    };

    if (state.transaction.parameters) {
      transaction.parameters = state.transaction.parameters;
    }

    operations.push(transaction);

    return {
      ...state as any,
      operations: operations
    } as T & StateTransaction & StateCounter & StateHead & StateConstants & StateManagerKey & StateOperations
  }),

  // run operation on node and calculate its gas consumption and storage size
  validateOperation(),

  // create operation 
  operation(),

  
  // catchError(error => {

  //   // autorecover from case when fundings is insuficient in case of account exhaustation
  //   if (error.response[0].id === "proto.alpha.contract.balance_too_low") {

  //     return of({
  //       ...error.state
  //     }).pipe(        
  //       transaction(state => ({
  //         ...state.transaction,
  //         amount: (error.response[0]['balance'] / 1000000).toString()
  //       }))
  //     );

  //   } else {
  //     return throwError(error);
  //   }
  // })
) //as Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>

