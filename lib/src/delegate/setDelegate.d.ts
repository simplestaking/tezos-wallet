import { Observable } from "rxjs";
import { State, SetDelegate } from "../common";
import { StateCounter, StateManagerKey } from "../contract";
import { StateOperations } from "../operation";
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
export declare const setDelegation: <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => Observable<T & StateSetDelegate & StateCounter & StateManagerKey & StateOperations & import("../src/head/getHead").StateHead & import("../src/operation/forgeOperation").StateOperation & State & import("../src/operation/signOperation").StateSignOperation & import("../src/operation/applyInjectOperation").StatePreapplyOperation & import("../src/operation/applyInjectOperation").StateInjectionOperation>;
