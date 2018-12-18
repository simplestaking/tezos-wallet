import { Observable } from "rxjs";
import { State, ActivateWallet, StateActivateWallet, StateOperation, StateOperations } from "../types";
/**
  * Activate wallet
  */
export declare const activateWallet: <T extends State>(fn: (state: T) => ActivateWallet) => (source: Observable<T>) => Observable<T & StateActivateWallet & StateOperations & import("../src/types/state").StateHead & import("../src/types/state").StateCounter & import("../src/types/state").StateManagerKey & StateOperation & import("../src/types/state").StateSignOperation & import("../src/types/state").StatePreapplyOperation & import("../src/types/state").StateInjectionOperation>;
