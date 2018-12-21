import { Observable } from "rxjs";
import { OperationMetadata, State } from "../common";
import { StateHead, StateInjectionOperation, StatePreapplyOperation, StateCounter, StateManagerKey, StateOperation, StateSignOperation } from '..';
export declare type StateOperations = {
    operations: OperationMetadata[];
};
/**
 * Create operation in blockchain.
 * Fully forge operation, validates it and inject into blockchain
 */
export declare const operation: () => <T extends State & StateOperations>(source: Observable<T>) => Observable<T & StateHead & StateCounter & StateManagerKey & StateOperation & State & StateSignOperation & StatePreapplyOperation & StateInjectionOperation>;
