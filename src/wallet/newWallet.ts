import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import {keys, WalletBase} from '../common';

/**
 * Generate new menomonic, private, public key & tezos wallet address 
 */
export const newWallet = () => (source: Observable<any>) => source.pipe(

    // create keys
    map(() => keys()),
    tap(state => {
      console.log('[+] mnemonic: "' + state.mnemonic + '"')
      console.log('[+] publicKey: "' + state.publicKey + '"')
      console.log('[+] publicKeyHash: "' + state.publicKeyHash + '"')
      console.log('[+] secretKey: "' + state.secretKey + '"')
    })
  
  )