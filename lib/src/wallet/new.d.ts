import { Observable } from "rxjs";
import { WalletBase } from "../types";
/**
 * Generate new menomonic, private, public key & tezos wallet address
 */
export declare const newWallet: () => <T>(source: Observable<T>) => Observable<WalletBase>;
