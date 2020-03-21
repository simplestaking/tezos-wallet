import * as sodium from 'libsodium-wrappers'

import { flatMap, concatMap, map, catchError, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";

import { State, NewWallet, keys} from '../common';

export type StateNewWallet = {
  newWallet: NewWallet
}


/**
 * Generate new menomonic, private, public key & tezos wallet address 
 */
export const newWallet = <T extends State>() => (source: Observable<T>) => source.pipe(
  flatMap(state => of({}).pipe(
  
      // sodium must be initialized  
      concatMap(() => Promise.resolve(sodium.ready)),
    
      map(() => ({
        ...state as any,
        newWallet: keys() as NewWallet,
      })),

      tap(state => {
        console.log(state.newWallet)
      }),  
    ))
  
  ) as Observable<T & StateNewWallet>