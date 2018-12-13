import { Observable } from "rxjs";
import { StateWallet, Wallet, State } from "../types";
/**
 * Wait for sodium to initialize
 */
export declare const initializeWallet: (selector: (params: StateWallet) => Wallet) => (source: Observable<any>) => Observable<State>;
