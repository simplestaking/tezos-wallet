import { Observable } from "rxjs";

import { State, WalletDetail, rpc} from "../common";

export type StateWalletDetail = {
  getWallet: WalletDetail
}

/** 
 * Get wallet details as balance
 * 
 * @url /chains/main/blocks/head/context/contracts/[walletPublicKey]/
 */
export const getWallet = <T extends State>() => (source: Observable<T>) =>
  source.pipe(

    // get contract info balance 
    rpc<T>(state => ({
      url: `/chains/main/blocks/head/context/contracts/${state.wallet.publicKeyHash}/`,
      path: 'getWallet'
    }))
   
  ) as Observable<T & StateWalletDetail>