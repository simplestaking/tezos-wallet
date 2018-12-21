import { Observable } from "rxjs";
import { State, SetDelegate } from "../common";
import { StateCounter, StateManagerKey } from "../contract";
import { StateOperations } from "../operation";
import { StateHead, StateSignOperation, StateOperation, StatePreapplyOperation, StateInjectionOperation } from '..';
export declare type StateSetDelegate = {
    setDelegate: SetDelegate;
};
/**
 *  Set delegation rights to tezos address
 *
 * @param selector provides data for delegation operation
 *
 * @operation reveal when wallet was not revealed yet
 * @operation delegation
 *
 * @example
 * of({}).
 * initializeWallet(state => {...wallet details}).
 * setDelegate(state => ({
 *  fee: string
 *  to: string
 * }))
 *
 */
export declare const setDelegation: <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => Observable<T & StateSetDelegate & StateCounter & StateManagerKey & StateOperations & StateHead & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
