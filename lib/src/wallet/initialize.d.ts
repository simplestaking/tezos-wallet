import { Observable } from "rxjs";
import { StateWallet, Wallet } from "../types";
/**
 * Wait for sodium to initialize
 */
export declare const initializeWallet: <T extends Wallet>(selector: (params: StateWallet) => T) => (source: Observable<any>) => Observable<{
    wallet: T;
}>;
