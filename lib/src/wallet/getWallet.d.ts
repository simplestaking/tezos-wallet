import { Observable } from "rxjs";
import { State, WalletDetail } from "../common";
export declare type StateWalletDetail = {
    getWallet: WalletDetail;
};
/**
 * Get wallet details as balance
 *
 * @url /chains/main/blocks/head/context/contracts/[walletPublicKey]/
 */
export declare const getWallet: <T extends State>() => (source: Observable<T>) => Observable<T & StateWalletDetail>;
