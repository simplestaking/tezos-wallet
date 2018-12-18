import { Observable } from "rxjs";
import { State, StateHead, StateSignOperation, StatePreapplyOperation, StateOperations, StateInjectionOperation } from "../types";
/**
 * Apply and inject operation into node
 */
export declare const applyAndInjectOperation: <T extends State & StateHead & StateOperations & StateSignOperation>() => (source: Observable<T>) => Observable<T & import("../src/types/state").StateCounter & StatePreapplyOperation & StateInjectionOperation>;
