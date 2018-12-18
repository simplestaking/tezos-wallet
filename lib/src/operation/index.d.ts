import { Observable } from "rxjs";
import { State, StateOperations } from "../types";
export * from './applyInject';
export * from './forge';
export * from './confirm';
export * from './pack';
export * from './pending';
/**
 * Create operation in blocchain
 */
export declare const operation: () => <T extends State>(source: Observable<T & StateOperations>) => Observable<T & StateOperations & import("../src/types/state").StateHead & import("../src/types/state").StateCounter & import("../src/types/state").StateManagerKey & import("../src/types/state").StateOperation & import("../src/types/state").StateSignOperation & import("../src/types/state").StatePreapplyOperation & import("../src/types/state").StateInjectionOperation>;
