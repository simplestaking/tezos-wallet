import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { State, OperationMetadata, OriginationOperationMetadata, StateOriginateContract } from "../types";
import { counter, managerKey } from "../helpers";
import * as utils from '../utils';
import { operation } from "../operation";


/**
 * Originate new delegatable contract from wallet  
 */
export const originateContract = <T extends State>(selector: (state: T) => any) => (source: Observable<T>) => source.pipe(

    map<T, T & StateOriginateContract>(state => ({
      ...state as any,
      originateContract: selector(state)
    })),
  
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
  
      if (state.manager_key.key === undefined) {
  
        operations.push({
          kind: "reveal",
          public_key: state.wallet.publicKey,
          source: state.wallet.publicKeyHash,
          fee: utils.parseAmount(state.originateContract.fee).toString(),
          gas_limit: "10100",
          storage_limit: "277",
          counter: (++state.counter).toString(),
        })
      }
  
      const originationOperation: OriginationOperationMetadata = {
        kind: "origination",
        source: state.wallet.publicKeyHash,
        fee: utils.parseAmount(state.originateContract.fee).toString(),
        balance: utils.parseAmount(state.originateContract.amount).toString(),
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
      }
    }),
  
    // create operation 
    operation()
  )