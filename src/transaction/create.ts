import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, Transaction, OperationMetadata } from "../types";
import * as utils from '../utils';
import { counter, managerKey } from "../helpers";
import { operation } from "../operation";

/**
 *  Transaction XTZ from one wallet to another
 */
export const transaction = <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => source.pipe(

    map(state => ({
      ...state,
      transaction: selector(state)
    })),
  
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
        operations.push({
          kind: "reveal",
          public_key: state.wallet.publicKey,
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
        amount: utils.parseAmount(state.transaction.amount).toString(),
        fee: utils.parseAmount(state.transaction.fee).toString(),
        gas_limit: "11000", // "250000", 
        storage_limit: "277",
        parameters: state.transaction.parameters,
        counter: (++state.counter).toString()
      });
  
      return {
        ...state,
        operations: operations
      }
    }),
    // tap((state) => console.log("[+] trasaction: operation " , state.operations)),
  
    // create operation 
    operation()
  )