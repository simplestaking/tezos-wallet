import { Observable } from "rxjs";
import { State, StateWalletDetail } from "../types";
/**
 * Get wallet details
 */
export declare const getWallet: <T extends State>() => (source: Observable<T>) => Observable<T & StateWalletDetail>;
