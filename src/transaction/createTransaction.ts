import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError, flatMap, switchMap } from "rxjs/operators";

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
    const withTestRun = state.transaction.testRun || false;
    const operations: OperationMetadata[] = [];

    if (state.manager_key === null) {

      if (typeof state.wallet.publicKey === undefined) {
        console.warn(`[transaction] Wallet public key not available!`);
      }

      operations.push({
        kind: "reveal",
        public_key: state.wallet.publicKey || '',
        source: state.wallet.publicKeyHash,
        fee: parseAmount(state.transaction.fee).toString(),
        // extra gas is for safety 
        gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10300",
        storage_limit: "0",
        counter: (++state.counter).toString()
      })
    }

    const transaction: TransactionOperationMetadata = {
      kind: "transaction",
      source: state.wallet.publicKeyHash,
      destination: state.transaction.to,
      amount: parseAmount(state.transaction.amount).toString(),
      fee: parseAmount(state.transaction.fee).toString(),
      // extra gas is for safety 
      gas_limit: withTestRun ? state.constants.hard_gas_limit_per_operation : "10400", 
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
  flatMap(state => {

    return (state.transaction.testRun ? validateOperation() : of(state)) as  Observable<T & StateTransaction & StateCounter & StateHead & StateConstants & StateManagerKey & StateOperations>;
  }),

  // create operation 
  operation()
)

