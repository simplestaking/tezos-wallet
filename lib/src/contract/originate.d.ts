import { Observable } from "rxjs";
import { State, OperationMetadata } from "../types";
/**
 * Originate new delegatable contract from wallet
 */
export declare const originateContract: <T extends State>(selector: (state: T) => any) => (source: Observable<T>) => Observable<T & {
    originateContract: any;
} & import("../types").StateCounter & {
    "operations": OperationMetadata[];
    manager_key: import("../types").ManagerKey;
} & import("../types").StateOperations & import("../types").StateHead & import("../types").StateManagerKey & import("../types").StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & import("../types").StatePreapplyOperation & import("../types").StateInjectionOperation>;
