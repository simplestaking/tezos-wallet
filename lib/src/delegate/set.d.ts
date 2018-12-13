import { Observable } from "rxjs";
import { State, SetDelegate, OperationMetadata } from "../types";
/**
 *  Set delegation rights to tezos address
 */
export declare const setDelegation: <T extends State>(selector: (state: T) => SetDelegate) => (source: Observable<T>) => Observable<T & {
    setDelegate: SetDelegate;
} & import("../types").StateCounter & {
    operations: OperationMetadata[];
    manager_key: import("../types").ManagerKey;
} & import("../types").StateOperations & import("../types").StateHead & import("../types").StateManagerKey & import("../types").StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & import("../types").StatePreapplyOperation & import("../types").StateInjectionOperation>;
