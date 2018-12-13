import { Observable } from "rxjs";

import { State, StateWalletDetail } from "../types";
import { rpc } from "../rpc";

/** 
 * Get wallet details
 */
export const getWallet = <T extends State>() => (source: Observable<T>) =>
  source.pipe(

    // get contract info balance 
    rpc<T>(state => ({
      url: '/chains/main/blocks/head/context/contracts/' + state.wallet.publicKeyHash + '/',
      path: 'getWallet'
    })),

    // show balance
    // tap(state => {
    //   console.log('[+] balance: ' + parseInt(state.getWallet.balance) / 1000000 + ' ꜩ  for: ' + state.wallet.publicKeyHash)
    // })
  ) as Observable<T & StateWalletDetail>