import { Observable } from "rxjs";

import { State, Head, rpc } from "../common";


export type StateHead = {
  head: Head
};

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
