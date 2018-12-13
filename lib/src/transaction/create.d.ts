import { Observable } from "rxjs";
import { State, Transaction, OperationMetadata } from "../types";
/**
 *  Transaction XTZ from one wallet to another
 */
export declare const transaction: <T extends State>(selector: (state: T) => Transaction) => (source: Observable<T>) => Observable<T & {
    transaction: Transaction;
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
