import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import * as utils from '../utils';
import { WalletBase } from "../types";

/**
 * Generate new menomonic, private, public key & tezos wallet address 
 */
export const newWallet = () => <T>(source: Observable<T>): Observable<WalletBase> => source.pipe(

    // create keys
    map(state => utils.keys()),
    tap(state => {
      console.log('[+] mnemonic: "' + state.mnemonic + '"')
      console.log('[+] publicKey: "' + state.publicKey + '"')
      console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"')
      console.log('[+] secretKey: "' + state.secretKey + '"')
    })
  
  )