import { Observable } from "rxjs";
import { State, Transaction, StateCounter, StateManagerKey, StateOperations, StateHead, StateOperation, StateSignOperation, StatePreapplyOperation, StateInjectionOperation } from "../types";
/**
 *  Transaction XTZ from one wallet to another
 */
export declare const transaction: <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => Observable<T & StateOperations & StateHead & StateCounter & StateManagerKey & StateOperation & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
