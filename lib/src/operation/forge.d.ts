import { Observable } from "rxjs";
import { State, StateOperations, StateHead, StateOperation } from "../types";
/**
 * Forge operation in blocchain
 */
export declare const forgeOperation: <T extends State & StateOperations>() => (source: Observable<T>) => Observable<T & StateHead & import("../types").StateCounter & import("../types").StateManagerKey & StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
}>;
export declare const forgeOperationAtomic: <T extends State & StateHead & StateOperations>() => (source: Observable<T>) => Observable<T & StateOperation>;
