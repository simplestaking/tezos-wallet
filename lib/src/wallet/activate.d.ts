import { Observable } from "rxjs";
import { State, ActivateWallet } from "../types";
/**
  * Activate wallet
  */
export declare const activateWallet: <T extends State>(fn: (state: T) => ActivateWallet) => (source: Observable<T>) => Observable<T & {
    operations: {
        kind: string;
        pkh: string;
        secret: string;
    }[];
    activateWallet: ActivateWallet;
} & import("../types").StateOperations & import("../types").StateHead & import("../types").StateCounter & import("../types").StateManagerKey & import("../types").StateOperation & {
    signOperation: {
        signature: string;
        signedOperationContents: string;
        operationHash: string;
    };
} & import("../types").StatePreapplyOperation & import("../types").StateInjectionOperation>;
