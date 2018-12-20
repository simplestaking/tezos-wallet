import { Observable } from "rxjs";

import { State, ManagerKey, rpc } from "../common";


export type StateManagerKey = {
  manager_key: ManagerKey
}
   
  /**
  * Get manager key for contract 
  */
  export const managerKey = <T extends State>() => (source: Observable<T>) => source.pipe(
  
    // get manager key for contract 
    rpc<T>((state) => ({
      url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/manager_key',
      path: 'manager_key' // @TODO: should not be 'manager' ??
    }))
  ) as Observable<T & StateManagerKey>