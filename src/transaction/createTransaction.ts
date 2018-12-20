import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import {  State, Transaction, OperationMetadata, parseAmount} from "../common";
import { counter, managerKey, StateCounter, StateManagerKey } from "../contract";
import { operation, StateOperations } from "../operation";


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

  // get contract counter
  counter(),

  // get contract managerKey
  managerKey(),

  // display transaction info to console
  tap(state => {
    console.log('[+] transaction: ' + state.transaction.amount + ' ꜩ  fee:' + state.transaction.fee + ' ' + 'from "' + state.wallet.publicKeyHash + '" to "' + state.transaction.to + '"')
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
        fee: "10000",
        gas_limit: "15000",
        storage_limit: "277",
        counter: (++state.counter).toString()
      })
    }

    operations.push({
      kind: "transaction",
      source: state.wallet.publicKeyHash,
      destination: state.transaction.to,
      amount: parseAmount(state.transaction.amount).toString(),
      fee: parseAmount(state.transaction.fee).toString(),
      gas_limit: "11000", // "250000", 
      storage_limit: "277",
      parameters: state.transaction.parameters,
      counter: (++state.counter).toString()
    });

    return {
      ...state as any,
      operations: operations
    } as T & StateTransaction & StateCounter & StateManagerKey & StateOperations
  }),
  // tap((state) => console.log("[+] trasaction: operation " , state.operations)),

  // create operation 
  operation()
) 