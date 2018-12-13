import * as sodium from 'libsodium-wrappers'
import { flatMap, concatMap, map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

import { StateWallet, Wallet, State } from "../types";

/**
 * Wait for sodium to initialize
 */
export const initializeWallet = (selector: (params: StateWallet) => Wallet) => (source: Observable<any>): Observable<State> => source.pipe(
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