import { Observable } from "rxjs";
import { State, StateOperations, StateHead, StateOperation, StateCounter, StateManagerKey, StateSignOperation } from "../types";
/**
 * Forge operation in blocchain
 */
export declare const forgeOperation: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & StateSignOperation>;
export declare const forgeOperationAtomic: <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => Observable<T & StateOperation>;
