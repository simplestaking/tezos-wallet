import { Observable } from "rxjs";
import { State, StateHead, StateWallet, StateCounter, StateManagerKey } from "../types";
/**
 * Get head for operation
 */
export declare const head: <T extends State>() => (source: Observable<T>) => Observable<T & StateHead>;
/**
 * Get counter for contract
 */
export declare const counter: <T extends StateWallet>() => (source: Observable<T>) => Observable<T & StateCounter>;
/**
* Get manager key for contract
*/
export declare const managerKey: <T extends StateWallet>() => (source: Observable<T>) => Observable<T & StateManagerKey>;
