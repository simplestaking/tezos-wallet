import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import {encryptKeys, WalletBase} from '../common';

/**
 * Encrypt wallet
 */
export const encryptWallet = (wallet: WalletBase, passphrase: string) => <T>(source: Observable<T>): Observable<any> => source.pipe(

  map(state => encryptKeys(wallet, passphrase)),
  // tap(state => {
  //   console.log('[+] state.encryptedWallet: ', state.encryptedWallet)
  // })

)