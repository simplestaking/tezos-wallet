import { Observable } from "rxjs";
import { State, ActivatedWallet } from "../common";
import { StateOperations } from "../operation";
import { StateInjectionOperation, StatePreapplyOperation, StateSignOperation, StateOperation, StateHead, StateCounter, StateManagerKey } from '..';
export declare type StateActivateWallet = {
    activateWallet: ActivatedWallet;
};
/**
  * Activate generated wallet address
  *
  * @operation activate_account
  * @returns Observable
  */
export declare const activateWallet: <T extends State>(selector: (state: T) => ActivatedWallet) => (source: Observable<T>) => Observable<T & StateActivateWallet & StateOperations & StateHead & StateCounter & StateManagerKey & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
