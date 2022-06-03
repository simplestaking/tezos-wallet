import { Observable } from "rxjs";

import { State, rpc, HeadConstants } from "../common";


export type StateConstants = {
  constants: HeadConstants
};

/**
 * Get constants used in block
 * 
 * @url "/chains/main/blocks/head/context/constants"
 */
export const constants = <T extends State>() => (source: Observable<T>) => source.pipe(

  // get head
  rpc<T>((state: T) => ({
    url: '/chains/main/blocks/head/context/constants',
    path: 'constants',
  }))
) as Observable<T & StateConstants>
