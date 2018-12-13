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
export declare const operation: () => <T extends State>(source: Observable<T & StateOperations>) => Observable<T & StateOperations & import("../types").StateHead & import("../types").StateCounter & import("../types").StateManagerKey & import("../types").StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & import("../types").StatePreapplyOperation & import("../types").StateInjectionOperation>;
