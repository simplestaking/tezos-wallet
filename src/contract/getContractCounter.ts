import { Observable } from "rxjs";

import { rpc, State } from "../common";


export type StateCounter = {
  counter: number
}


  /**
   * Get contract counter
   *
   * @url /chains/main/blocks/head/context/contracts/[publicKeyHash]/counter
   */
  export const counter = <T extends State>() => (source: Observable<T>) => source.pipe(

    // get counter for contract
    rpc<T>((state) => ({
      url: `/chains/main/blocks/head/context/contracts/${state.wallet.publicKeyHash}/counter`,
      path: 'counter',
    }))
  ) as Observable<T & StateCounter>
