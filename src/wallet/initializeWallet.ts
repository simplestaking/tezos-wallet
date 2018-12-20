import * as sodium from 'libsodium-wrappers'
import { flatMap, concatMap, map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

import { Wallet } from "../common";


export type StateWallet = {
  wallet: Wallet
}

/**
 * Waits for sodium to initialize and prepares wallet for working with it
 * Should be the first step of every workflow
 * 
 */
export const initializeWallet = <T extends Wallet>(selector: (params: StateWallet) => T) => (source: Observable<any>): Observable<{ wallet: T }> => source.pipe(
  flatMap(state => of({}).pipe(

    // wait for sodium to initialize
    concatMap(() => Promise.resolve(sodium.ready)),

    // exec callback function and add result state
    map(() => ({
      wallet: selector(state)
    })),

    catchError((error: any) => {
      console.warn('[initializeWallet][sodium] ready', error)

      // this might not work. Why we do not propagate error further?
      // incompatible
      return of({
        ...state,
        error
      })
    })
  ))
)