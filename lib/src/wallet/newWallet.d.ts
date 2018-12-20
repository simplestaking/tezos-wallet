import { Observable } from "rxjs";
import { WalletBase } from '../common';
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export declare const newWallet: () => (source: Observable<any>) => Observable<WalletBase>;
