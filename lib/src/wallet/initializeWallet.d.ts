import { Observable } from "rxjs";
import { Wallet } from "../common";
export declare type StateWallet = {
    wallet: Wallet;
};
/**
 * Waits for sodium to initialize and prepares wallet for working with it
 * Should be the first step of every workflow
 *
 */
export declare const initializeWallet: <T extends Wallet>(selector: (params: StateWallet) => T) => (source: Observable<any>) => Observable<{
    wallet: T;
}>;
