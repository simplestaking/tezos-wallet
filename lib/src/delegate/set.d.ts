import { Observable } from "rxjs";
import { State, SetDelegate } from "../types";
/**
 *  Set delegation rights to tezos address
 */
export declare const setDelegation: <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => Observable<any>;
