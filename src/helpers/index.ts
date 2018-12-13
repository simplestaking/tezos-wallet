import { Observable } from "rxjs";

import { State, StateHead, StateWallet, StateCounter, StateManagerKey } from "../types";
import { rpc } from "../rpc";

/**
 * Get head for operation
 */
export const head = <T extends State>() => (source: Observable<T>) => source.pipe(

    // get head
    rpc<T>((state: T) => ({
      url: '/chains/main/blocks/head',
      path: 'head',
    }))
  ) as Observable<T & StateHead>
  
  /**
   * Get counter for contract  
   */
  export const counter = <T extends StateWallet>() => (source: Observable<T>) => source.pipe(
  
    // get counter for contract
    rpc<T>((state) => ({
      url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/counter',
      path: 'counter',
    }))
  ) as Observable<T & StateCounter>
  
  /**
  * Get manager key for contract 
  */
  export const managerKey = <T extends StateWallet>() => (source: Observable<T>) => source.pipe(
  
    // get manager key for contract 
    rpc<T>((state) => ({
      url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
      path: 'manager_key' // @TODO: should not be 'manager' ??
    }))
  ) as Observable<T & StateManagerKey>