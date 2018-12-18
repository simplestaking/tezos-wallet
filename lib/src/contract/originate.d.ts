import { Observable } from "rxjs";
import { State } from "../types";
/**
 * Originate new delegatable contract from wallet
 */
export declare const originateContract: <T extends State>(selector: (state: T) => any) => (source: Observable<T>) => Observable<any>;
